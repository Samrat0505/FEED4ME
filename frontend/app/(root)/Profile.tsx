import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  Box,
  ChevronDown,
  Languages,
  LeafyGreenIcon,
  Sprout,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import BottomSheetComponent from "~/components/BottomSheetComponent";
import TabComponent from "~/components/TabComponent";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlobalContext } from "~/Context/ContextProvider";
import { getFarmerProfile } from "~/lib/Api";
import { changeLanguage } from "~/lib/i18next";
import { User } from "~/lib/Types";
import { cn } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import LucidIcons from "~/lib/LucidIcons";

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useGlobalContext();

  const [isLogoutModel, setisLogoutModel] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

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
      <View
        className="flex-1 bg-white"
        style={{ paddingTop: StatusBar.currentHeight || 0 }}
      >
        <TouchableOpacity
          onPress={() => setisLogoutModel(true)}
          className="items-center mt-4"
        >
          <Image
            source={{
              uri: "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg",
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-xl font-bold text-gray-900">
            {user?.user?.name}
          </Text>
          <Text className="text-gray-600">{user?.user?.email}</Text>
        </TouchableOpacity>
        <Button
          variant={"outline"}
          className="flex flex-row gap-3 items-center justify-center m-5 mb-0"
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
          className="mx-5 mt-3"
          onPress={() => setisLogoutModel(true)}
        >
          <Text className="text-white text-center font-semibold">
            {t("Log Out")}
          </Text>
        </Button>
      </View>
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
      <AlertDialog open={isLogoutModel} onOpenChange={setisLogoutModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. you will be log out from this
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <Button
              variant={"destructive"}
              onPress={() => {
                setUser(null);
                AsyncStorage.removeItem("user");
                router.replace("/MainScreen");
                setisLogoutModel(false);
              }}
            >
              <Text className="text-white text-center font-semibold">
                {t("Log Out")}
              </Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileScreen;
