import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  ToastAndroid,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Box, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { getFarmerProfile, getMyInventories, Inventory } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { useTranslation } from "react-i18next";
import LucidIcons from "~/lib/LucidIcons";
import { User } from "~/lib/Types";
import TabComponent from "~/components/TabComponent";
import i18n from "~/lib/i18next";

export default function FarmerView() {
  const { t } = useTranslation();
  const { user } = useGlobalContext();

  const [isPurchaseInventoryLoading, setisPurchaseInventoryLoading] =
    useState<boolean>(true);
  const [isStorageRentLoading, setisStorageRentLoading] =
    useState<boolean>(true);
  const [storageRentData, setStorageRentData] = useState<Inventory[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [TotalAreaReserved, setTotalAreaReserved] = useState<number>(0);
  const [TotalAreaAdded, setTotalAreaAdded] = useState<number>(0);
  const [currentTab, setcurrentTab] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (user?.user.role === "farmer") {
        const data = await getFarmerProfile(user.token);
        if (data) {
          setUserData(data);
          setisPurchaseInventoryLoading(false);
        }
      } else {
        setisPurchaseInventoryLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    userData?.inventory?.forEach((e: any) => {
      setTotalAreaReserved((prev) => prev + e.area);
    });
    return () => {
      setTotalAreaReserved(0);
    };
  }, [userData?.inventory]);

  useEffect(() => {
    storageRentData?.forEach((e: Inventory) => {
      setTotalAreaAdded((prev) => prev + e.totalQuantity);
    });
    return () => {
      setTotalAreaAdded(0);
    };
  }, [storageRentData]);

  useEffect(() => {
    fetchAddedInventories();
  }, []);

  const fetchAddedInventories = async () => {
    const Inventories = await getMyInventories(user.token, user.user._id);
    Inventories && setStorageRentData(Inventories);
    setisStorageRentLoading(false);
  };

  const tabsData = useMemo(() => {
    return [{ name: t("Purchased Inventory") }, { name: t("Rented Storage") }];
  }, [i18n.language]);

  const TabPages = useMemo(() => {
    return [
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-3 pt-0">
          {isPurchaseInventoryLoading ? (
            <View className="flex items-center justify-center pt-20">
              <LucidIcons IconName={Box} size={50} strokeWidth={1} />
              <View className="flex items-center justify-center p-8 flex-row gap-3">
                <ActivityIndicator animating />
                <Text>{t("Loading your Inventories....")}</Text>
              </View>
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
                        onPress={() => {
                          router.push(
                            `/(root)/(storage)/StorageDetails?storageId=${unit.id}&storageName=${unit?.name}`
                          );
                        }}
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
                  <Button
                    variant={"secondary"}
                    className="m-3"
                    onPress={() =>
                      router.push(
                        "/(root)/(storage)/InventoriesPurchaseMapView"
                      )
                    }
                  >
                    <Text>Purchase more inventories</Text>
                  </Button>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>,
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-3 pt-0">
          {isStorageRentLoading ? (
            <View className="flex items-center justify-center pt-20">
              <LucidIcons IconName={Box} size={50} strokeWidth={1} />
              <View className="flex items-center justify-center p-8 flex-row gap-3">
                <ActivityIndicator animating />
                <Text>{t("Loading your Inventories....")}</Text>
              </View>
            </View>
          ) : (
            <View className="px-3 mt-3">
              {storageRentData?.length === 0 ? (
                <Text>{t("No Inventories")}</Text>
              ) : (
                <>
                  {storageRentData?.map((unit: Inventory, index) => {
                    return (
                      <Pressable
                        key={index}
                        className="p-5 rounded-xl my-1 border border-muted"
                        onPress={() => {
                          router.push(
                            `/(root)/(storage)/StorageDetails?storageId=${unit._id}&storageName=${unit?.name}`
                          );
                        }}
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
                              {t("Active")}
                            </Text>
                          </View>
                        </View>
                        <View className="space-y-2 mt-2">
                          <Text className="text-sm text-gray-600">
                            Crop type : {unit.crop.toLocaleUpperCase()}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {t("Remaining Quantity")}:{" "}
                            {unit.totalQuantity - unit.reservedQuantity} sq feet
                          </Text>

                          <Text className="text-sm text-gray-600">
                            {t("Price Per Unit (PPU)")} : {unit.pricePerUnit}{" "}
                            INR
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {t("Storage address")} : {unit.location.address} INR
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {t("Taken by")}: {unit.takenBy?.length}{" "}
                            {t("Buyers")}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </>
              )}
              <Button
                onPress={() => router.push("/(root)/(storage)/AddNewInventory")}
                variant={"outline"}
                className="flex flex-row gap-3 items-center justify-center my-5"
              >
                <LucidIcons IconName={Plus} />
                <Text>{t("Add more Inventories")}</Text>
              </Button>

              <View className="p-10" />
            </View>
          )}
        </View>
      </ScrollView>,
    ];
  }, [userData, storageRentData]);

  return (
    <>
      <View className="flex-row justify-between px-3">
        {[
          {
            value: isPurchaseInventoryLoading ? (
              <ActivityIndicator animating />
            ) : (
              userData?.inventory?.length
            ),
            label: t("Total purchased inventories"),
          },
          {
            value: isStorageRentLoading ? (
              <ActivityIndicator animating />
            ) : (
              storageRentData?.length
            ),
            label: t("Total Storage rent"),
          },
          {
            value:
              currentTab === 0 ? (
                isPurchaseInventoryLoading ? (
                  <ActivityIndicator animating />
                ) : (
                  TotalAreaReserved
                )
              ) : isStorageRentLoading ? (
                <ActivityIndicator animating />
              ) : (
                TotalAreaAdded
              ),
            label:
              currentTab === 0
                ? t("Total area reserved (sq feet)")
                : t("Total area added (sq feet)"),
          },
        ].map((stat, index) => (
          <View
            key={index}
            className="p-5 rounded-xl items-center w-[32%] border border-muted"
          >
            <Text className="text-2xl font-bold text-green-800 mt-2 text-center">
              {stat.value}
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
      <TabComponent
        tabsData={tabsData}
        Pages={TabPages}
        setCurrentTab={setcurrentTab}
      />
    </>
  );
}
