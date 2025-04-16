import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useGlobalContext } from "~/Context/ContextProvider";
import { WasteReport } from "~/lib/Types";
import { cn } from "~/lib/utils";
import { handleStatusUpdate } from "~/lib/Api";

const WasteDetails = ({
  wasteData,
  setModelVisible,
}: {
  wasteData: WasteReport;
  setModelVisible: Function;
}) => {
  const { user } = useGlobalContext();
  const [status, setStatus] = useState(wasteData.status);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [statusLoading, setstatusLoading] = useState<boolean>(false);
  const [allowedStatuses, setallowedStatuses] = useState<string[]>([]);

  const STATUS_OPTIONS = ["pending", "picked up", "delivered", "canceled"];

  const handleStatusUpdateFunction = async () => {
    if (statusLoading) return;
    setstatusLoading(true);
    const data = await handleStatusUpdate(
      user.token,
      wasteData._id,
      selectedStatus
    );
    if (data) {
      setStatus(selectedStatus);
      setModelVisible(false);
    }
    setstatusLoading(false);
  };

  const getAllowedNextStatuses = (current: string) => {
    switch (current) {
      case "pending":
        return ["picked up", "canceled"];
      case "picked up":
        return ["delivered"];
      case "delivered":
      case "canceled":
      default:
        return [];
    }
  };
  useEffect(() => {
    const statuses = getAllowedNextStatuses(wasteData.status.toLowerCase());
    setallowedStatuses(statuses);
  }, [wasteData]);

  return (
    <>
      <ScrollView className="p-4 bg-white h-full">
        <Text className="text-xl font-bold mb-4">Waste Report</Text>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">Donor</Text>
          <Text className="text-base font-semibold">
            {wasteData.donor_details?.name}
          </Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">Email</Text>
          <Text className="text-base">{wasteData.donor_details?.email}</Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">Food Type</Text>
          <Text className="text-base">
            {wasteData.foodType} - {wasteData.quantity}
          </Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">Waste Type</Text>
          <Text className="text-base">{wasteData.wasteType}</Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">Prepared On</Text>
          <Text className="text-base">{wasteData.preparedOn}</Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">Collection Point</Text>
          <Text className="text-base">
            {wasteData.collectionPoint?.address}
          </Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500">NGO</Text>
          <Text className="text-base">{wasteData.ngo_details?.name}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-sm text-gray-500">Status</Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-emerald-100 px-2 py-1 rounded-full">
              <Text className="text-emerald-600 font-medium text-sm">
                {status}
              </Text>
            </View>
          </View>
        </View>
        {/* {wasteData.imageUrl && (
        <Image
          source={{ uri: `${BASE_URL}${wasteData.imageUrl}` }}
          className="w-full h-40 rounded-xl mb-4"
          resizeMode="cover"
        />
      )} */}
        {status.toLowerCase() !== "delivered" &&
          status.toLowerCase() !== "canceled" && (
            <>
              <Text className="text-sm text-gray-500 mb-2">
                Select New Status
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {STATUS_OPTIONS.map((option) => {
                  const isDisabled =
                    option === status || !allowedStatuses.includes(option);
                  const isSelected = selectedStatus === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        if (!isDisabled) setSelectedStatus(option);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full border",
                        isSelected
                          ? "bg-emerald-600 border-emerald-700"
                          : "bg-gray-100 border-gray-300",
                        isDisabled && "opacity-40"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-sm",
                          isSelected ? "text-white font-bold" : "text-gray-700"
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                onPress={handleStatusUpdateFunction}
                disabled={selectedStatus === status || statusLoading}
                className={cn(
                  "px-4 py-3 rounded-xl",
                  selectedStatus === status ? "bg-gray-300" : "bg-emerald-600"
                )}
              >
                {statusLoading ? (
                  <ActivityIndicator animating />
                ) : (
                  <Text
                    className={cn(
                      "text-center font-semibold",
                      selectedStatus === status ? "text-gray-600" : "text-white"
                    )}
                  >
                    Update Status
                  </Text>
                )}
              </Pressable>
            </>
          )}
      </ScrollView>
    </>
  );
};

export default WasteDetails;
