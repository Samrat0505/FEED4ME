import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { getStorageDetailsByID, Inventory, purchaseInventory } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Box } from "lucide-react-native";
import LucidIcons from "~/lib/LucidIcons";
import { getFarmerProfile } from  "~/lib/Api";
import { User } from "~/lib/Types";

const StorageDetails = () => {
  const router = useRouter();
  const { storage } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const [details, setDetails] = useState<Inventory | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [remainingPercentage, setremainingPercentage] = useState<number>(0);
  const [purchasedQuantity, setpurchasedQuantity] = useState<number>(0);
  const [purchaseLoading, setpurchaseLoading] = useState<boolean>(false);
  const [detailsLoading, setdetailsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const temp = JSON.parse(`${storage}`) as Inventory;
    // setDetails(JSON.parse(`${storage}`) as Inventory);
    setDetails(temp);
    //67d55ffadd85cc341df87fdc
    //67d55ffadd85cc341df87fdc
    console.log("inside use effect")
    console.log(temp)
    setOwner(temp.owner);
  }, [storage]);


  useEffect(() => {
    details &&
      setremainingPercentage(
        ((details.totalQuantity - details.reservedQuantity) /
          details.totalQuantity) *
          100
      );
  }, [details]);

    useEffect(() => {
      (async () => {
        if (user?.user.role === "farmer") {
          const data = await getFarmerProfile(user.token);
          if (data) {
            setUserData(data);
          }
        }
      })();
    }, [user]);

  if (!details) return <View />;

  if (user.user.role === "storage")
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{ headerShown: true, title: `${details.name}` }}
        />
        <View className="p-3">
          <View className="p-5 border border-slate-200 rounded-lg">
            <View className="flex justify-between text-sm mb-2">
              <Text className="text-slate-500">Storage Capacity</Text>
              <Text className="font-medium">
                {details.totalQuantity} sq feet (
                {(100 - remainingPercentage).toFixed(2)}% filled)
              </Text>
            </View>
            <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <View
                className="bg-emerald-500 h-full rounded-full"
                style={{
                  width: `${remainingPercentage}%`,
                }}
              ></View>
            </View>
            <View className="flex justify-between mt-2">
              <Text>Reserved: {details.reservedQuantity} sq feet</Text>
              <Text>
                Available: {details.totalQuantity - details.reservedQuantity} sq
                feet
              </Text>
            </View>

            <View className="my-1">
              <Text className="text-xs text-slate-500">Crop</Text>
              <Text className="font-medium">
                {details.crop.toLocaleUpperCase()}
              </Text>
            </View>
            <View className="my-1">
              <Text className="text-xs text-slate-500">Price</Text>
              <Text className="font-medium text-emerald-600">
                {details.pricePerUnit} per sq feet
              </Text>
            </View>
            <View className="my-1">
              <Text className="text-xs text-slate-500">Taken By</Text>
              <Text className="font-medium">
                {details.takenBy.length} buyers
              </Text>
            </View>
            <View className="my-1">
              <Text className="text-xs text-slate-500">Location</Text>
              <Text className="font-medium">{details.location.address}</Text>
            </View>
          </View>
          {details?.takenBy?.length !== 0 && (
            <>
              <Text className="text-sm font-semibold text-slate-600 px-1 mt-5 mb-2">
                Purchased by
              </Text>

              {details?.takenBy?.map((e, i) => {
                return (
                  <View
                    key={i}
                    className="p-4 border rounded-lg my-1 border-blue-100"
                  >
                    <View className="flex justify-between items-center flex-row">
                      <View>
                        <Text className="text-indigo-800 font-medium">
                          {e.quantity} sq feet
                        </Text>
                        <Text className="text-sm text-slate-500">
                          12 Jan 2025
                        </Text>
                      </View>
                      <Text className="bg-white border rounded-full px-2 text-indigo-600 border-indigo-200">
                        Active
                      </Text>
                    </View>
                    <Text className="text-sm">farmer Id : {e.farmer}</Text>
                  </View>
                );
              })}
            </>
          )}

          <View className="p-3" />
        </View>
      </ScrollView>
    );

  if (user.user.role === "farmer") {
    const fetchUpdatedDetails = async () => {
      setdetailsLoading(true);
      const data: Inventory | null = await getStorageDetailsByID(
        details._id,
        user.token
      );
      setDetails(data ? data : details);
      setdetailsLoading(false);
    };
    const purchaseHandler = async () => {
      if (purchasedQuantity === 0) {
        ToastAndroid.show("Enter quantity", ToastAndroid.SHORT);
        return;
      }

      if (
        purchasedQuantity >
        details.totalQuantity - details.reservedQuantity
      ) {
        ToastAndroid.show(
          "Purchase should be less than remaining quantity",
          ToastAndroid.SHORT
        );
        return;
      }
      setpurchaseLoading(true);
      try {
        details &&
          (await purchaseInventory(
            user.token,
            details?._id,
            purchasedQuantity
          ));
        setpurchasedQuantity(0);
        fetchUpdatedDetails();
      } catch (error) {
      } finally {
        setpurchaseLoading(false);
      }
    };
    if (detailsLoading)
      return (
        <View className="flex items-center justify-center h-screen">
          <LucidIcons IconName={Box} size={50} strokeWidth={1} />
          <View className="flex items-center justify-center p-8 flex-row gap-3">
            <ActivityIndicator animating />
            <Text>Loading new data....</Text>
          </View>
        </View>
      );
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{ headerShown: true, title: `${details.name}` }}
        />

        <View className="p-3">
          <View className="p-5 border border-slate-200 rounded-lg">
            <View className="flex justify-between text-sm mb-2">
              <Text className="text-slate-500">Storage Capacity</Text>
              <Text className="font-medium">
                {details.totalQuantity} sq feet (
                {(100 - remainingPercentage).toFixed(2)}% filled)
              </Text>
            </View>
            <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <View
                className="bg-emerald-500 h-full rounded-full"
                style={{
                  width: `${remainingPercentage}%`,
                }}
              ></View>
            </View>
            <View className="flex justify-between mt-2">
              <Text>Reserved: {details.reservedQuantity} sq feet</Text>
              <Text>
                Available: {details.totalQuantity - details.reservedQuantity} sq
                feet
              </Text>
            </View>

            <View className="my-1">
              <Text className="text-xs text-slate-500">Crop</Text>
              <Text className="font-medium">
                {details.crop.toLocaleUpperCase()}
              </Text>
            </View>
            <View className="my-1">
              <Text className="text-xs text-slate-500">Price</Text>
              <Text className="font-medium text-emerald-600">
                {details.pricePerUnit} per sq feet
              </Text>
            </View>
            <View className="my-1">
              <Text className="text-xs text-slate-500">Taken By</Text>
              <Text className="font-medium">
                {details.takenBy.length} buyers
              </Text>
            </View>
            <View className="my-1">
              <Text className="text-xs text-slate-500">Location</Text>
              <Text className="font-medium">{details.location.address}</Text>
            </View>
            <View className="my-1">
              <Pressable
                onPress={() => {
                  console.log("inside the on press function")
                  const recieverId = owner;
                  const senderId = userData?._id;
                  console.log(recieverId, senderId)
                  const chatId = String([senderId, recieverId].sort().join("-"));
                  router.push({
                    pathname: '/chat/[chatId]',
                    params: { chatId, senderId, recieverId },
                  });
                }}
                className="bg-emerald-500 py-2 px-4 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">
                  Chat with Owner
                </Text>
              </Pressable>
            </View>
          </View>

          <View>
            {details?.takenBy.filter((e) => e.farmer === user?.user._id)
              ?.length !== 0 && (
              <>
                <Text className="text-sm font-semibold text-slate-600 px-1 mt-5 mb-2">
                  Your Purchases
                </Text>
                {details?.takenBy?.map((e, i) => {
                  return (
                    user.user._id === e.farmer && (
                      <View
                        key={i}
                        className="p-4 border rounded-lg my-1 border-blue-100"
                      >
                        <View className="flex justify-between items-center flex-row">
                          <View>
                            <Text className="text-indigo-800 font-medium">
                              {e.quantity} sq feet
                            </Text>
                            <Text className="text-sm text-slate-500">
                              12 Jan 2025
                            </Text>
                          </View>
                          <Text className="bg-white border rounded-full px-2 text-indigo-600 border-indigo-200">
                            Active
                          </Text>
                        </View>
                      </View>
                    )
                  );
                })}
              </>
            )}
          </View>
          <View className="p-5 bg-white border-slate-200 border rounded-xl my-4">
            <Text className="text-sm font-semibold text-slate-600">
              Purchase Additional Storage
            </Text>
            <View className="my-4">
              <Input
                keyboardType="numeric"
                placeholder="Enter quantity"
                className="pr-12 bg-slate-50 border-slate-200 h-12 focus:border-indigo-300"
                onChangeText={(text) =>
                  setpurchasedQuantity(parseInt(text) || 0)
                }
              />
              <Text className="absolute right-3 top-3 text-sm text-slate-500">
                sq ft
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                Price: ₹{details.pricePerUnit} per sq feet
              </Text>
            </View>
            <Button
              onPress={purchaseHandler}
              disabled={purchaseLoading || purchasedQuantity === 0}
              className="w-full bg-indigo-600"
            >
              {purchaseLoading ? (
                <View className="flex items-center justify-center flex-row gap-3">
                  <ActivityIndicator animating />
                  <Text>Purchasing...</Text>
                </View>
              ) : (
                <Text>Purchase Storage</Text>
              )}
            </Button>
          </View>

          <View className="p-3" />
        </View>
      </ScrollView>
    );
  }

  return <View />;
};

export default StorageDetails;
