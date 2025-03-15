import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ChevronDown,
  HeartPulse,
  Languages,
  MapPin,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheetComponent from "~/components/BottomSheetComponent";
import LucidIcons from "~/components/LucidIcons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlobalContext } from "~/Context/ContextProvider";
import { getFarmerProfile } from "~/lib/Api";
import { changeLanguage } from "~/lib/i18next";
import { cn } from "~/lib/utils";

const ProfileScreen = () => {
  const { user, setUser } = useGlobalContext();
  const [userData, setUserData] = useState<{
    age: string;
    crops: [];
    customers: [];
    email: string;
    location: string;
    name: string;
  } | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

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

  useEffect(() => {
    (async () => {
      const data = await getFarmerProfile(user.token);
      if (data) {
        setUserData(data.data);
        setisLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <View
        style={{ paddingTop: StatusBar.currentHeight || 0 + 15 }}
        className="flex-1 bg-white p-5"
      >
        <View className="items-center">
          <Image
            source={{
              uri: "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg",
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-xl font-bold text-gray-900">
            {user.user.name}
          </Text>
          <Text className="text-gray-600">{user.user.email}</Text>
        </View>
        <Button
          variant={"outline"}
          className="flex flex-row gap-3 items-center justify-center mx-3 mt-5"
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
        <Button
          variant={"destructive"}
          className="mx-3 mt-3"
          onPress={() => {
            setUser(null);
            AsyncStorage.removeItem("user");
            router.replace("/MainScreen");
          }}
        >
          <Text className="text-white text-center font-semibold">
            {t("Log Out")}
          </Text>
        </Button>

        <View className="mt-6 p-4 border border-muted rounded-lg bg-gray-50 flex-row justify-between">
          <View className="flex-row gap-2 item-center">
            <LucidIcons IconName={HeartPulse} />
            <Text className="text-gray-700"> {user.user.age}</Text>
          </View>
          <View className="flex-row gap-2 item-center">
            <LucidIcons IconName={MapPin} />
            <Text className="text-gray-700">{user.user.location}</Text>
          </View>
        </View>
        <View className="my-5">
          {isLoading ? (
            <View className="flex flex-row gap-2 justify-center">
              <ActivityIndicator animating />
              <Text>{t("Loading crops and customers...")}</Text>
            </View>
          ) : (
            <View>
              <Text>
                {t("Crops")} : {JSON.stringify(userData?.crops)}
              </Text>
              <Text>
                {t("Customers")} : {JSON.stringify(userData?.customers)}
              </Text>
            </View>
          )}
        </View>
      </View>
      <BottomSheetComponent
        ref={bottomSheetRef}
        title={t("Select Language")}
        subTitle={t("Choose your preferred language")}
        snapPoints={["40%"]}
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

export default ProfileScreen;
