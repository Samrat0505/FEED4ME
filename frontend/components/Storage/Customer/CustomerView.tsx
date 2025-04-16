import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getMyInventories } from "~/lib/Api";
import { Inventory } from "~/lib/Types";
import { useGlobalContext } from "~/Context/ContextProvider";
import LucidIcons from "~/lib/LucidIcons";
import { Box, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";

const CustomerView = () => {
  const { t } = useTranslation();
  const { user } = useGlobalContext();
  const [isStorageRentLoading, setisStorageRentLoading] =
    useState<boolean>(true);
  const [storageRentData, setStorageRentData] = useState<Inventory[]>([]);

  useEffect(() => {
    fetchAddedInventories();
  }, []);

  const fetchAddedInventories = async () => {
    const Inventories = await getMyInventories(user.token, user.user._id);
    Inventories && setStorageRentData(Inventories);
    setisStorageRentLoading(false);
  };
  return (
    <FlatList
      contentContainerClassName="p-3 pt-0"
      data={storageRentData}
      renderItem={({ item }) => (
        <Pressable
          className="p-5 rounded-xl my-1 border border-muted"
          onPress={() => {
            router.push(
              `/(root)/(storage)/StorageDetails?storageId=${item._id}&storageName=${item?.name}`
            );
          }}
        >
          <View className="flex-row justify-between items-center my-1">
            <View className="flex-row items-center">
              <LucidIcons IconName={Box} size={24} color="green" />
              <Text className="text-lg font-bold ml-3 text-gray-800">
                {item.name}
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
              Crop type : {item.crop.toLocaleUpperCase()}
            </Text>
            <Text className="text-sm text-gray-600">
              {t("Remaining Quantity")}:{" "}
              {item.totalQuantity - item.reservedQuantity} sq feet
            </Text>

            <Text className="text-sm text-gray-600">
              {t("Price Per item (PPU)")} : {item.pricePerUnit} INR
            </Text>
            <Text className="text-sm text-gray-600">
              {t("Storage address")} : {item.location.address} INR
            </Text>
            <Text className="text-sm text-gray-600">
              {t("Taken by")}: {item.takenBy?.length} {t("Buyers")}
            </Text>
          </View>
        </Pressable>
      )}
      refreshControl={
        <RefreshControl
          refreshing={isStorageRentLoading}
          onRefresh={fetchAddedInventories}
        />
      }
      ListEmptyComponent={
        <View className="py-20">
          <Text className="text-center">{t("No Inventories")}</Text>
        </View>
      }
      ListFooterComponent={
        <>
          <Button
            onPress={() => router.push("/(root)/(storage)/AddNewInventory")}
            variant={"outline"}
            className="flex flex-row gap-3 items-center justify-center my-5"
          >
            <LucidIcons IconName={Plus} />
            <Text>{t("Add more Inventories")}</Text>
          </Button>

          <View className="p-10" />
        </>
      }
      ListHeaderComponent={<Text className="mb-2 px-3">Rented Storage</Text>}
    />
  );
};

export default CustomerView;
