import {
  View,
  Pressable,
  FlatList,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalContext } from "~/Context/ContextProvider";
import { PurchaseCrop } from "~/lib/Types";
import { getCropsForCustomer, purchaseCropsForCustomer } from "~/lib/Api";
import { Crops } from "~/lib/constants";
import LucidIcons from "~/lib/LucidIcons";
import { IndianRupee, PackageCheck } from "lucide-react-native";
import TabComponent from "~/components/TabComponent";
import { useTranslation } from "react-i18next";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComponent from "../BottomSheetComponent";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";

const CustomerView = () => {
  const { t, i18n } = useTranslation();
  const purchaseBottomSheet = useRef<BottomSheet>(null);
  const { user } = useGlobalContext();
  const [cropData, setCropData] = useState<PurchaseCrop[]>([]);
  const [selectedcropData, setselectedcropData] = useState<PurchaseCrop | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [stockToPurchase, setstockToPurchase] = useState<number>(0);
  const [purchaseloading, setpurchaseloading] = useState<boolean>(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    if (user.user.role === "customer") {
      setLoading(true);
      const data = await getCropsForCustomer(user.token);
      setCropData(data);
      setLoading(false);
    }
  };
  const getCropEmoji = (cropName: string): string => {
    const match = Crops.find(
      (c) => c.name.toLowerCase() === cropName.toLowerCase()
    );
    return match ? match.emoji : "🧺";
  };

  const renderItem = ({ item }: { item: PurchaseCrop }) => {
    const emoji = getCropEmoji(item.name);
    return (
      <Pressable
        onPress={() => {
          setselectedcropData(item);
          item.stock !== 0 && purchaseBottomSheet.current?.expand();
        }}
        className={cn(
          "m-2 rounded-xl border border-muted my-1",
          item.stock === 0 && "bg-gray-50 opacity-50"
        )}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">{emoji}</Text>
              <Text className="text-lg font-semibold text-gray-800">
                {item.name}
              </Text>
            </View>
            <View className="bg-emerald-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-emerald-600">
                {item.stock === 0 ? "Unavailable" : "Available"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <LucidIcons IconName={PackageCheck} size={16} />
            <Text className="text-sm text-gray-600">
              Stock:
              <Text className="font-medium text-gray-800">
                {" "}
                {item.stock} kg
              </Text>
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <LucidIcons IconName={IndianRupee} size={16} />
            <Text className="text-sm text-gray-600">
              MRP:
              <Text className="font-medium text-gray-800"> ₹{item.MRP}</Text>
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const tabsData = useMemo(() => {
    return [{ name: t("Buy crops") }, { name: t("Track Purchases") }];
  }, [i18n.language]);

  const TabPages = useMemo(() => {
    return [
      <FlatList
        data={cropData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={loading}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCrops} />
        }
        ListEmptyComponent={() => {
          return !loading ? (
            <Text className="text-center text-gray-500 mt-10">
              No crops available.
            </Text>
          ) : (
            <View />
          );
        }}
      />,
      <ScrollView showsVerticalScrollIndicator={false} key="purchase-tab">
        <View className="p-20">
          <Text className="text-center">No purchase history</Text>
        </View>
      </ScrollView>,
    ];
  }, [cropData]);

  const purchaseHandler = async () => {
    if (purchaseloading) return;
    setpurchaseloading(true);
    selectedcropData?.farmerID &&
      (await purchaseCropsForCustomer(
        user.token,
        selectedcropData?.farmerID,
        user.user._id,
        selectedcropData?._id,
        stockToPurchase
      ));
    fetchCrops();
    purchaseBottomSheet.current?.close();
    setstockToPurchase(0);
    setpurchaseloading(false);
  };
  return (
    <>
      <TabComponent tabsData={tabsData} Pages={TabPages} />
      {selectedcropData && (
        <BottomSheetComponent
          title="Purchase"
          subTitle="Enter details to purchase crop"
          backdropOpacity={0.6}
          BottomSheetFooterComponent={
            <>
              <Button
                disabled={
                  selectedcropData?.stock < stockToPurchase || purchaseloading
                }
                className={cn(
                  "m-2",
                  selectedcropData?.stock < stockToPurchase && "opacity-50"
                )}
                onPress={purchaseHandler}
              >
                {purchaseloading ? (
                  <ActivityIndicator animating />
                ) : (
                  <Text>Purchase</Text>
                )}
              </Button>
              <Button
                variant={"secondary"}
                className="m-2"
                onPress={() => purchaseBottomSheet.current?.close()}
              >
                <Text>Cancel</Text>
              </Button>
            </>
          }
          ref={purchaseBottomSheet}
          children={
            <KeyboardAvoidingView>
              <View className="p-5">
                <Input
                  placeholder="Enter amount to buy"
                  keyboardType="number-pad"
                  onChangeText={(text) => setstockToPurchase(parseInt(text))}
                />

                {selectedcropData?.stock < stockToPurchase ? (
                  <Text className=" text-red-500 my-1">
                    Amount can't be more than available stock
                  </Text>
                ) : (
                  <Text className="my-1">
                    {stockToPurchase.toString() === "NaN"
                      ? ""
                      : `Total amount for ${stockToPurchase} kg is ${
                          stockToPurchase * selectedcropData.MRP
                        } INR`}
                  </Text>
                )}
              </View>
            </KeyboardAvoidingView>
          }
        />
      )}
    </>
  );
};

export default CustomerView;
