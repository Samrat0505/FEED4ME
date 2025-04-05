import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { ChevronDown, Languages, Sprout } from "lucide-react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComponent from "~/components/BottomSheetComponent";
import i18n, { changeLanguage } from "~/lib/i18next";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import LucidIcons from "~/lib/LucidIcons";
const MainScreen = () => {
  const { height, width } = Dimensions.get("screen");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { t, i18n } = useTranslation();

  const changeLanguageHandler = (lng: string) => {
    changeLanguage(lng);
    bottomSheetRef.current?.close();
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
  ];

  return (
    <>
      <ScrollView>
        <View className="flex-1 dark:bg-black">
          <View
            style={{
              paddingTop: StatusBar.currentHeight,
            }}
            className="flex items-center justify-center"
          >
            <View className="p-2 flex justify-end w-full items-end mr-4">
              <Button
                variant={"outline"}
                className="flex flex-row gap-3 items-center justify-center"
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <LucidIcons IconName={Languages} />
                <Text>
                  {i18n.language === "en"
                    ? "English"
                    : i18n.language === "hi" && "हिन्दी"}
                </Text>
                <LucidIcons IconName={ChevronDown} />
              </Button>
            </View>
            {/* <Image
              source={require("assets/Images/HomeImage.svg")}
              style={{ width: width - 50, height: height / 2 }}
              contentFit="contain"
            /> */}
            <View
              style={{ width: width - 50, height: height / 2 }}
              className="flex items-center justify-around"
            >
              <Text className="text-3xl font-bold">{t("Lets you in")}</Text>
              <LucidIcons IconName={Sprout} size={100} strokeWidth={1.1} />
            </View>
          </View>

          <Button
            variant="secondary"
            className="m-5 rounded-full mb-1"
            onPress={() => {
              router.push("/Login");
            }}
          >
            <Text>{t("Sign in with password")}</Text>
          </Button>

          <Button
            variant="link"
            className="rounded-full"
            onPress={() => {
              router.push("/SignUp");
            }}
          >
            <Text>
              {t("don't have a account?")} {"  "}
              <Text className="text-blue-700 underline">{t("Sign up")}</Text>
            </Text>
          </Button>
        </View>
      </ScrollView>
      <BottomSheetComponent
        ref={bottomSheetRef}
        title={t("Select Language")}
        subTitle={t("Choose your preferred language")}
        backdropOpacity={0.6}
        BottomSheetFooterComponent={
          <Button onPress={() => bottomSheetRef.current?.close()}>
            <Text>{t("Close")}</Text>
          </Button>
        }
      >
        <View className="p-4">
          {languages.map(({ code, label }) => (
            <TouchableOpacity
              key={code}
              onPress={() => changeLanguageHandler(code)}
              className={cn(
                "p-3 mb-2 rounded-lg border border-muted",
                i18n.language === code && "bg-gray-200 dark:bg-gray-700"
              )}
            >
              <Text className="text-lg text-center">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetComponent>
    </>
  );
};

export default MainScreen;
