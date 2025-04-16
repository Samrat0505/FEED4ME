import { View, ActivityIndicator, Pressable } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import LucidIcons from "~/lib/LucidIcons";
import {
  Clock,
  MapPin,
  PackageSearch,
  Recycle,
  Soup,
  Sprout,
  Users2,
} from "lucide-react-native";
import { getWasteReportToNgo } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { WasteReport } from "~/lib/Types";
import ModelComponent from "~/components/ModelComponent";
import WasteDetails from "./wasteDetails";
import { Text } from "~/components/ui/text";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

const NgoFunctions = ({ HeaderComponent }: { HeaderComponent: Function }) => {
  const { user } = useGlobalContext();
  const [wasteReport, setWastereport] = useState<WasteReport[]>([]);
  const [selectedWasteData, setselectedWasteData] =
    useState<WasteReport | null>(null);
  const [wasteReportLoading, setWastereportLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setWastereportLoading(true);
    const data = await getWasteReportToNgo(user?.token);
    setWastereport(data);
    setWastereportLoading(false);
  };

  const renderItem = ({ item }: { item: WasteReport }) => {
    const parsedPreparedOn =
      typeof item.preparedOn === "string"
        ? item.preparedOn.replace(/^on /, "")
        : "";
    const formattedDate = parsedPreparedOn || "Not specified";

    return (
      <Pressable
        onPress={() => {
          setselectedWasteData(item);
          setIsVisible(true);
        }}
      >
        <View className="border border-muted bg-white rounded-2xl m-2 p-2">
          <View className="flex-row items-center gap-2 mb-2">
            <LucidIcons IconName={Users2} size={16} />
            <Text className="font-semibold text-base">
              Donor: {item.donor_details?.name ?? "Unknown"}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <LucidIcons IconName={MapPin} size={16} />
            <Text className="text-sm text-muted-foreground">
              {item.collectionPoint?.address ?? "No address"}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <LucidIcons IconName={Soup} size={16} />
            <Text className="text-sm">
              {item.foodType ?? "Unknown"} - {item.quantity ?? "?"}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <LucidIcons IconName={PackageSearch} size={16} />
            <Text className="text-sm">
              Waste Type: {item.wasteType ?? "N/A"}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <LucidIcons IconName={Clock} size={16} />
            <Text className="text-sm text-muted-foreground">
              Prepared: {formattedDate}
            </Text>
          </View>

          {item.availableOn && (
            <View className="flex-row items-center gap-2 mb-1">
              <LucidIcons IconName={Clock} size={16} />
              <Text className="text-sm text-muted-foreground">
                Available: {item.availableOn}
              </Text>
            </View>
          )}

          <View className="flex-row items-center gap-2 mb-1">
            <Text
              className={`text-sm font-medium ${
                item.status?.toLowerCase() === "pending"
                  ? "text-yellow-600"
                  : "text-emerald-600"
              }`}
            >
              Status: {item.status}
            </Text>
          </View>

          <Text className="text-xs text-muted-foreground mt-2">
            NGO: {item.ngo_details?.name ?? "Not assigned"}
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <View>
      {wasteReportLoading ? (
        <View className="flex items-center justify-center pt-10 h-screen">
          <LucidIcons IconName={Recycle} size={50} strokeWidth={1} />

          <View className="flex items-center justify-center p-8 flex-row gap-3">
            <ActivityIndicator animating />
            <Text>Loading data....</Text>
          </View>
        </View>
      ) : (
        <View>
          {wasteReport.length === 0 ? (
            <View className="flex items-center justify-center pt-10 border border-muted mx-4 rounded-xl">
              <LucidIcons IconName={Recycle} size={50} strokeWidth={1} />

              <View className="flex items-center justify-center p-8 pt-3 flex-row gap-3">
                <Text>No Waste Reported yet</Text>
              </View>
            </View>
          ) : (
            <>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={wasteReport}
                keyExtractor={(item, index) => `${item._id}-${index}`}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={wasteReportLoading}
                    onRefresh={fetchData}
                  />
                }
                ListHeaderComponent={<>{HeaderComponent()}</>}
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 mt-8">
                    No waste reports found.
                  </Text>
                }
              />
              {selectedWasteData && (
                <ModelComponent
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                  children={
                    <WasteDetails
                      wasteData={selectedWasteData}
                      setModelVisible={setIsVisible}
                    />
                  }
                />
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default NgoFunctions;
