import i18n, { LanguageDetectorAsyncModule } from "i18next";
import * as Localization from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import en from "./locals/en.json";
import hi from "./locals/hi.json";
import { initReactI18next } from "react-i18next";

const LOCAL_FILES: Record<string, string> = {
  en: FileSystem.cacheDirectory + "en.json",
  hi: FileSystem.cacheDirectory + "hi.json",
};

const resources = { en: { translation: en }, hi: { translation: hi } };

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const savedLang = await AsyncStorage.getItem("language");
      if (savedLang) {
        callback(savedLang);
        return savedLang;
      }

      const bestLanguage = Localization.findBestLanguageTag(
        Object.keys(resources)
      );
      const detectedLang = bestLanguage?.languageTag || "en";

      await AsyncStorage.setItem("language", detectedLang);
      callback(detectedLang);
      return detectedLang;
    } catch (error) {
      console.error("Language detection error:", error);
      callback("en");
      return "en";
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    await AsyncStorage.setItem("language", lng);
  },
};

const fetchTranslation = async (
  text: string,
  targetLang: string,
  currentLang: string
) => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${currentLang}|${targetLang}`
    );
    const data = await response.json();
    return data?.responseData?.translatedText || text;
  } catch (error) {
    console.error("Translation API error:", error);
    return text;
  }
};

const saveTranslationsToFile = async (
  lang: string,
  translations: Record<string, string>
) => {
  try {
    const filePath = LOCAL_FILES[lang];

    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify({}));
    }

    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(translations));
  } catch (error) {
    console.error("Error saving translations to file:", error);
  }
};

const loadTranslationsFromFile = async (
  lang: string
): Promise<Record<string, string>> => {
  try {
    const filePath = LOCAL_FILES[lang];
    const fileExists = await FileSystem.getInfoAsync(filePath);

    if (!fileExists.exists) return {};

    const content = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(content);
  } catch (error) {
    console.error("Error loading translations from file:", error);
    return {};
  }
};

export const getTranslations = async (
  texts: Record<string, string>,
  targetLang: string,
  currentLang: string = "en"
) => {
  try {
    const storedTranslations = await loadTranslationsFromFile(targetLang);
    const missingKeys = Object.keys(texts).filter(
      (key) => !storedTranslations[key]
    );

    if (missingKeys.length === 0) return storedTranslations;

    const fetchedTranslations: Record<string, string> = {
      ...storedTranslations,
    };

    await Promise.all(
      missingKeys.map(async (key) => {
        fetchedTranslations[key] = await fetchTranslation(
          texts[key],
          targetLang,
          currentLang
        );
      })
    );

    await saveTranslationsToFile(targetLang, fetchedTranslations);
    return fetchedTranslations;
  } catch (error) {
    console.error("Error fetching translations:", error);
    return {};
  }
};

export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
