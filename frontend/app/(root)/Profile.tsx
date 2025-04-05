import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Box, ChevronDown, Languages } from "lucide-react-native";
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
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);
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

  useEffect(() => {
    (async () => {
      if (user?.user.role === "farmer") {
        const data = await getFarmerProfile(user.token);
        if (data) {
          setUserData(data);
          setisLoading(false);
        }
      } else {
        setisLoading(false);
      }
    })();
  }, [user]);

  const tabsData = useMemo(() => {
    return [
      { name: t("Purchased Inventory") },
      { name: t("Crops") },
      { name: t("Customers") },
    ];
  }, [i18n.language]);

  const TabPages = useMemo(() => {
    return [
      <ScrollView>
        <View className="p-3">
          {isLoading ? (
            <View className="flex flex-row gap-2 justify-center my-9">
              <ActivityIndicator animating />
              <Text>{t("Loading purchased storage...")}</Text>
            </View>
          ) : (
            <>
              {userData?.inventory.length === 0 ? (
                <Text className="text-center my-9">
                  {t("No Tnventory purchased yet")}
                </Text>
              ) : (
                <>
                  {userData?.inventory.map((unit: any, index) => {
                    return (
                      <Pressable
                        key={index}
                        className="p-5 rounded-xl my-1 border border-muted"
                      >
                        <View className="flex-row justify-between items-center my-1">
                          <View className="flex-row items-center">
                            <LucidIcons
                              IconName={Box}
                              size={24}
                              color="green"
                            />
                            <Text className="text-lg font-bold ml-3 text-gray-800">
                              {unit.name}
                            </Text>
                          </View>
                          <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-700 font-bold text-sm">
                              Active
                            </Text>
                          </View>
                        </View>
                        <View className="space-y-2 mt-2">
                          <Text className="text-sm text-gray-600">
                            Crop type: {unit.crop.toLocaleUpperCase()}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Area reserved : {unit.area}
                          </Text>

                          <Text className="text-sm text-gray-600">
                            Area cost : {unit.cost} INR
                          </Text>
                          <Text className="text-sm text-gray-600">
                            owner : {unit.owner}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>,
      <ScrollView>
        <View className="p-3">
          {isLoading ? (
            <View className="flex flex-row gap-2 justify-center my-9">
              <ActivityIndicator animating />
              <Text>{t("Loading crops...")}</Text>
            </View>
          ) : (
            <View>
              {userData?.crops.length === 0 ? (
                <Text className="text-center my-9">
                  {t("No crops registered yet")}
                </Text>
              ) : (
                <Text>{JSON.stringify(userData?.crops, null, 5)}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>,
      <ScrollView>
        <View className="p-3">
          {isLoading ? (
            <View className="flex flex-row gap-2 justify-center my-9">
              <ActivityIndicator animating />
              <Text>{t("Loading customers...")}</Text>
            </View>
          ) : (
            <>
              {userData?.customers.length === 0 ? (
                <Text className="text-center my-9">
                  {t("No customers yet")}
                </Text>
              ) : (
                <Text>{JSON.stringify(userData?.customers, null, 5)}</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>,
    ];
  }, [userData, i18n.language]);

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
          variant={"ghost"}
          className="flex flex-row gap-3 items-center justify-center mx-7 my-5 mt-3"
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
        {user?.user?.role === "farmer" ? (
          <TabComponent tabsData={tabsData} Pages={TabPages} />
        ) : (
          <>
            <Button
              variant={"destructive"}
              className="mx-3 mt-3"
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
          </>
        )}
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
