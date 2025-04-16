import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  Linking,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Info,
  ChevronRight,
  PhoneCall,
  Calendar,
  User2Icon,
  MapPin,
  Link2Icon,
  HandPlatter,
  Trash,
  MapIcon,
  ArrowLeft,
} from "lucide-react-native";
import { router } from "expo-router";
import { getNgoList, NGO } from "~/lib/Api";
import LucidIcons from "~/lib/LucidIcons";
import { useGlobalContext } from "~/Context/ContextProvider";
import { Button } from "~/components/ui/button";
import { t } from "i18next";
import ModelComponent from "~/components/ModelComponent";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from "react-native";

interface WasteStats {
  TotalNgoRegistered: number;
  foodWasteSaved: string;
  peopleHelped: number;
  co2Reduced: string;
}

const wasteStats: WasteStats = {
  TotalNgoRegistered: 245,
  foodWasteSaved: "1,230 kg",
  peopleHelped: 890,
  co2Reduced: "3.5 tons",
};

export default function WasteManagementScreen() {
  const { user } = useGlobalContext();
  const [NgoData, setNgoData] = useState<NGO[] | []>([]);
  const [NgoLoading, setNgoLoading] = useState<boolean>(true);
  const [ismapViewModel, setismapViewModel] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await getNgoList(
        user?.user.location.coordinates.coordinates[0],
        user?.user.location.coordinates.coordinates[1]
      );
      setNgoData(data);
      setNgoLoading(false);
    })();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Pressable
          className="flex-row items-center justify-center gap-3 p-4 mt-4 bg-white border border-muted rounded-lg"
          onPress={() => router.push("/(root)/(Wastage)/selfWasteReport")}
        >
          {/* <LucidIcons IconName={HandPlatter} color="green" /> */}
          <Text className="text-lg font-medium text-green-500">
            Leftover food
          </Text>
        </Pressable>

        <View className="mt-6 p-4 bg-gray-100 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Your Impact
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {Object.entries(wasteStats).map(([key, value]) => (
              <View
                key={key}
                className="w-[48%] bg-white p-3 mb-3 rounded-lg shadow-sm items-center"
              >
                <Text className="text-xl font-bold text-green-600">
                  {value}
                </Text>
                <Text className="text-xs text-gray-500">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          className="flex-row items-center justify-center gap-3 p-4 mt-4 bg-white border border-muted rounded-lg"
          onPress={() =>
            router.push(
              `/(root)/(Wastage)/ReportFoodWaste?ngoList=${JSON.stringify(
                NgoData.map((item: NGO) => ({
                  _id: item._id,
                  name: item.name,
                }))
              )}`
            )
          }
        >
          <LucidIcons IconName={Info} color="red" />
          <Text className="text-lg font-medium text-red-500">
            Report Food Waste
          </Text>
        </Pressable>

        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Nearby NGO Partnerships
          </Text>
          <Button
            className="my-5 mx-1 flex items-center justify-center gap-3 flex-row"
            variant={"secondary"}
            onPress={() => {
              setismapViewModel(true);
            }}
          >
            <LucidIcons IconName={MapIcon} />
            <Text>{t("Map View")}</Text>
          </Button>
          <View>
            {NgoLoading ? (
              <View className="flex items-center justify-center gap-3 flex-row py-20">
                <ActivityIndicator animating />
                <Text>Loading Ngos</Text>
              </View>
            ) : (
              <>
                {NgoData.length === 0 ? (
                  <View className="flex items-center justify-center gap-3 flex-row py-20">
                    <Text>No Ngos listed Right now</Text>
                  </View>
                ) : (
                  <>
                    {NgoData?.map((data: NGO, index: number) => {
                      const formattedDate = new Date(
                        data.establishment
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <View
                          key={index}
                          className="bg-white dark:bg-neutral-900 rounded-2xl border border-muted dark:border-neutral-700 p-3 my-1"
                        >
                          <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                              {data.name}
                            </Text>
                            <Text className="text-xs text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-800 px-2 py-0.5 rounded-full">
                              {data.status}
                            </Text>
                          </View>

                          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                            Reg. No: {data.registration_number}
                          </Text>
                          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                            Focus Area: {data.focusAreas}
                          </Text>

                          <View className="mb-2 flex items-center justify-start gap-2 flex-row">
                            <LucidIcons IconName={MapPin} />
                            <Text className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                              {data.location.address}
                            </Text>
                          </View>

                          <View className="mb-2 flex items-center justify-start gap-2 flex-row">
                            <LucidIcons IconName={User2Icon} />
                            <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                              {data.contactPerson}
                            </Text>
                          </View>

                          <Pressable
                            onPress={() =>
                              Linking.openURL(`tel:${data.contactPerson_phone}`)
                            }
                          >
                            <View className="mb-2 flex items-center justify-start gap-2 flex-row">
                              <LucidIcons IconName={PhoneCall} />
                              <Text className="text-sm text-blue-600 underline dark:text-blue-400">
                                {data.contactPerson_phone}
                              </Text>
                            </View>
                          </Pressable>

                          {data.website !== "0" && (
                            <Pressable
                              onPress={() => Linking.openURL(data.website)}
                            >
                              <View className="mb-2 flex items-center justify-start gap-2 flex-row">
                                <LucidIcons IconName={Link2Icon} />
                                <Text className="text-sm text-blue-600 underline dark:text-blue-400">
                                  {data.website}
                                </Text>
                              </View>
                            </Pressable>
                          )}

                          <View className="mb-2 flex items-center justify-start gap-2 flex-row">
                            <LucidIcons IconName={Calendar} />
                            <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                              Established on {formattedDate}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </View>
          {NgoData.length !== 0 && (
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
                      latitude: NgoData[0].location.coordinates.coordinates[0],
                      longitude: NgoData[0].location.coordinates.coordinates[1],
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    loadingEnabled={true}
                    showsMyLocationButton={true}
                  >
                    {NgoData.map((marker: NGO, index: number) => {
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
                          description={marker.location.address}
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
                      <Text>Total {NgoData?.length} Ngo</Text>
                    </Button>
                  </View>
                </>
              }
            />
          )}
        </View>

        {/* <View className="mt-6 mb-10">
          <Text className="text-lg font-semibold text-gray-900">
            Food Redistribution
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Donate surplus food to those in need
          </Text>
          <Pressable
            className="flex-row items-center justify-center bg-green-600 rounded-lg py-4 gap-2"
            onPress={() => router.push("/(root)/(Wastage)/ReportFoodWaste")}
          >
            <Gift stroke="#FFF" width={24} height={24} />
            <Text className="text-white text-base font-semibold">
              Donate Now
            </Text>
          </Pressable>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
