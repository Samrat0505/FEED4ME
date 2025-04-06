import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { router, Stack } from "expo-router";
import { ArrowLeft, Box, Map, Plus } from "lucide-react-native";
import { useGlobalContext } from "~/Context/ContextProvider";
import { useEffect, useState } from "react";
import { getMyInventories, Inventory } from "~/lib/Api";
import { Button } from "~/components/ui/button";
import ModelComponent from "~/components/ModelComponent";
import AddInventory from "~/components/Storage/Storage manager/AddInventory";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";
import LucidIcons from "~/lib/LucidIcons";

const StorageManagerView = () => {
  const { t } = useTranslation();

  const { user } = useGlobalContext();
  const [Inventories, setInventories] = useState<Inventory[]>([]);
  const [InventoryLoading, setInventoryLoading] = useState<boolean>(true);
  const [addNewInventoryModel, setaddNewInventoryModel] =
    useState<boolean>(false);
  const [ismapViewModel, setismapViewModel] = useState<boolean>(false);
  const [markerDoubleTap, setmarkerDoubleTap] = useState<boolean>(false);
  const [totalCapacity, setTotalCapacity] = useState<number>(0);
  const [reservedCapacity, setreservedCapacity] = useState<number>(0);

  useEffect(() => {
    fetchMyInventories();
  }, []);

  const fetchMyInventories = async () => {
    const Inventories = await getMyInventories(user.token);
    Inventories && setInventories(Inventories);
    setInventoryLoading(false);
  };

  useEffect(() => {
    Inventories?.forEach((e) => {
      setTotalCapacity((prev) => prev + e.totalQuantity);
      setreservedCapacity((prev) => prev + e.reservedQuantity);
    });
    return () => {
      setTotalCapacity(0);
      setreservedCapacity(0);
    };
  }, [Inventories]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true }} />
      {InventoryLoading ? (
        <View className="flex items-center justify-center h-screen">
          <LucidIcons IconName={Box} size={50} strokeWidth={1} />
          <View className="flex items-center justify-center p-8 flex-row gap-3">
            <ActivityIndicator animating />
            <Text>{t("Loading your Inventories....")}</Text>
          </View>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between px-3">
              {[
                {
                  value: Inventories?.length,
                  label: t("Total Inventories"),
                },
                { value: totalCapacity, label: t("Total Capacity") },
                { value: reservedCapacity, label: t("Reserved Capacity") },
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

            <View className="px-3 mt-3">
              <Text className="text-xl font-semibold text-gray-800 mb-1 px-1">
                {t("Storage Units")}
              </Text>

              {Inventories.length === 0 ? (
                <Text>{t("No Inventories")}</Text>
              ) : (
                <>
                  <Button
                    className="my-5 mx-1 flex items-center justify-center gap-3 flex-row"
                    variant={"outline"}
                    onPress={() => {
                      setismapViewModel(true);
                    }}
                  >
                    <LucidIcons IconName={Map} />
                    <Text>{t("Map View")}</Text>
                  </Button>
                  <Button
                    className="my-5 mx-1 flex items-center justify-center gap-3 flex-row"
                    variant={"outline"}
                    onPress={() => {
                      router.push("/chat");
                    }}
                  >
                    <LucidIcons IconName={Map} />
                    <Text>{t("Chat with Farmers")}</Text>
                  </Button>
                  {Inventories.map((unit: Inventory, index) => {
                    return (
                      <Pressable
                        key={index}
                        className="p-5 rounded-xl my-1 border border-muted"
                        onPress={() => {
                          router.push(
                            `/(root)/(storage)/StorageDetails?storage=${JSON.stringify(
                              unit
                            )}`
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
                onPress={() => setaddNewInventoryModel(true)}
                variant={"outline"}
                className="flex flex-row gap-3 items-center justify-center my-5"
              >
                <LucidIcons IconName={Plus} />
                <Text>{t("Add more Inventories")}</Text>
              </Button>
            </View>
          </ScrollView>
          <ModelComponent
            isVisible={addNewInventoryModel}
            setIsVisible={setaddNewInventoryModel}
            children={
              <AddInventory
                token={user.token}
                setaddNewInventoryModel={setaddNewInventoryModel}
                fetchMyInventories={fetchMyInventories}
              />
            }
          />

          {Inventories.length !== 0 && (
            <ModelComponent
              isVisible={ismapViewModel}
              setIsVisible={setismapViewModel}
              children={
                <>
                  <MapView
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").height,
                    }}
                    initialRegion={{
                      latitude:
                        Inventories[0].location.coordinates.coordinates[0],
                      longitude:
                        Inventories[0].location.coordinates.coordinates[1],
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    loadingEnabled={true}
                    showsMyLocationButton={true}
                  >
                    {Inventories.map((marker: Inventory, index: number) => {
                      return (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude:
                              marker?.location.coordinates.coordinates[0],
                            longitude:
                              marker?.location.coordinates.coordinates[1],
                          }}
                          title={marker.name}
                          // description={marker.location.address}
                          description="Tap on selected marker to see more details"
                          onPress={() => {
                            setmarkerDoubleTap(true);
                            if (markerDoubleTap) {
                              setismapViewModel(false);
                              router.push(
                                `/(root)/(storage)/StorageDetails?storage=${JSON.stringify(
                                  marker
                                )}`
                              );
                              setmarkerDoubleTap(false);
                            }
                          }}
                        />
                      );
                    })}
                  </MapView>
                  <View
                    className="absolute flex items-center justify-between flex-row w-full p-5"
                    style={{ top: StatusBar.currentHeight || 0 }}
                  >
                    <Button
                      variant={"outline"}
                      className="rounded-full flex gap-3 flex-row justify-center items-center"
                      onPress={() => setismapViewModel(false)}
                    >
                      <LucidIcons IconName={ArrowLeft} />
                    </Button>
                    <Button
                      variant={"outline"}
                      className="rounded-full flex gap-3 flex-row justify-center items-center"
                    >
                      <Text>Total {Inventories?.length} Inventories</Text>
                    </Button>
                  </View>
                </>
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default StorageManagerView;
