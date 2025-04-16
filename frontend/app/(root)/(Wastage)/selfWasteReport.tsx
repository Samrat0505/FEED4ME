import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getMyReportedWaste } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import {
  MapPin,
  Clock3,
  Truck,
  User2,
  ShieldCheck,
  Hourglass,
  Trash2,
  PersonStanding,
} from "lucide-react-native";
import { WasteFood } from "~/lib/constants";
import { WasteReport } from "~/lib/Types";

const getFoodEmoji = (foodType: string) => {
  const match = WasteFood.find((item) =>
    foodType.toLowerCase().includes(item.name.toLowerCase())
  );
  return match ? match.icon : "🍽️";
};

const SelfWasteReport = () => {
  const { user } = useGlobalContext();
  const [wasteList, setWasteList] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWasteData = useCallback(async () => {
    try {
      const data = await getMyReportedWaste(user.user._id);
      setWasteList(data);
    } catch (err) {
      console.error("Error fetching waste:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.user._id]);

  useEffect(() => {
    fetchWasteData();
  }, [fetchWasteData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWasteData();
  };

  const renderItem = ({ item }: { item: WasteReport }) => (
    <View className="p-4 mb-2 rounded-xl border border-muted">
      <View className="flex-row items-center mb-3">
        <Text className="text-3xl mr-2">{getFoodEmoji(item.foodType)}</Text>
        <Text className="text-xl font-semibold text-gray-900 capitalize">
          {item.foodType}
        </Text>
      </View>

      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-44 rounded-xl mb-4 bg-gray-100"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-44 rounded-xl bg-gray-50 justify-center items-center mb-4">
          <Text className="text-gray-400 text-sm">No Image</Text>
        </View>
      )}

      <View className="mb-4">
        <Text className="text-gray-800 font-semibold mb-2 text-sm tracking-wide">
          📦 Pickup Details
        </Text>

        <View className="flex-row items-center mb-2">
          <MapPin size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-700 text-sm">
            {item.collectionPoint?.address}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Clock3 size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-700 text-sm">
            {new Date(item.preparedOn).toLocaleString()}
          </Text>
        </View>

        <Text className="text-sm text-gray-600 mb-1">
          📦 Quantity:{" "}
          <Text className="font-medium text-gray-800">{item.quantity}</Text>
        </Text>

        <Text className="text-sm text-gray-600">
          🗑️ Waste Type:{" "}
          <Text className="capitalize font-medium text-gray-800">
            {item.wasteType}
          </Text>
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-800 font-semibold mb-2 text-sm tracking-wide">
          🏢 NGO Info
        </Text>
        <View className="flex-row items-center">
          <User2 size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-700 text-sm">
            {item.ngo_details?.name || "Unassigned"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap items-center gap-2 mt-2">
        {/* Status Badge */}
        <View
          className={`flex-row items-center px-3 py-1 rounded-full ${
            item.status.toLowerCase() === "picked up"
              ? "bg-green-100"
              : "bg-yellow-100"
          }`}
        >
          {item.status.toLowerCase() === "picked up" ? (
            <ShieldCheck size={14} color="#15803d" className="mr-1" />
          ) : (
            <Hourglass size={14} color="#ca8a04" className="mr-1" />
          )}
          <Text
            className={`text-xs font-semibold ${
              item.status.toLowerCase() === "picked up"
                ? "text-green-700"
                : "text-yellow-700"
            }`}
          >
            {item.status}
          </Text>
        </View>

        {/* Waste Type Badge */}
        <View className="flex-row items-center px-3 py-1 rounded-full bg-blue-100">
          <PersonStanding size={14} color="#1e40af" className="mr-1" />
          <Text className="text-xs font-semibold text-blue-700 capitalize">
            {item.wasteType}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center flex-row gap-3">
        <ActivityIndicator animating />
        <Text>Loading your waste reports...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wasteList}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text className="text-center text-gray-400 mt-10 text-base">
          🫙 No waste reports found.
        </Text>
      }
    />
  );
};

export default SelfWasteReport;
