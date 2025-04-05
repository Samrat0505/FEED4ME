import React from "react";
import { View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import { ArrowLeft, Info, ChevronRight, Gift } from "lucide-react-native";

// ✅ Define TypeScript types
interface NGO {
  id: number;
  name: string;
  description: string;
  distance: string;
}

interface WasteStats {
  totalReported: number;
  foodWasteSaved: string;
  peopleHelped: number;
  co2Reduced: string;
}

// ✅ Dummy Data
const ngoPartnerships: NGO[] = [
  {
    id: 1,
    name: "Food Rescue Org",
    description: "Rescuing surplus food from restaurants and events",
    distance: "1.2 km",
  },
  {
    id: 2,
    name: "Green Earth Initiative",
    description: "Promoting sustainable waste management practices",
    distance: "2.5 km",
  },
  {
    id: 3,
    name: "Zero Hunger Project",
    description: "Fighting hunger through food redistribution",
    distance: "3.7 km",
  },
  {
    id: 4,
    name: "EcoWaste Solutions",
    description: "Innovative approaches to waste reduction",
    distance: "4.1 km",
  },
];

const wasteStats: WasteStats = {
  totalReported: 245,
  foodWasteSaved: "1,230 kg",
  peopleHelped: 890,
  co2Reduced: "3.5 tons",
};

export default function WasteManagementScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        {/* ✅ Report Food Waste */}
        <Pressable
          className="flex-row items-center gap-3 p-4 mt-4 bg-white border border-muted rounded-lg"
          onPress={() => console.log("Report food waste")}
        >
          <Info stroke="#000" width={24} height={24} />
          <Text className="text-lg font-medium text-gray-900">
            Report Food Waste
          </Text>
        </Pressable>

        {/* ✅ Your Impact */}
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

        {/* ✅ NGO Partnerships */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Nearby NGO Partnerships
          </Text>
          {ngoPartnerships.map((ngo) => (
            <Pressable
              key={ngo.id}
              className="bg-white border border-muted rounded-lg mb-3 p-4 flex-row justify-between items-center"
              onPress={() => console.log(`Selected NGO: ${ngo.name}`)}
            >
              <View>
                <Text className="text-base font-medium text-gray-900">
                  {ngo.name}
                </Text>
                <Text className="text-sm text-gray-500">{ngo.description}</Text>
                <Text className="text-xs font-medium text-green-600">
                  {ngo.distance}
                </Text>
              </View>
              <ChevronRight stroke="#6B7280" width={24} height={24} />
            </Pressable>
          ))}
        </View>

        {/* ✅ Food Redistribution */}
        <View className="mt-6 mb-10">
          <Text className="text-lg font-semibold text-gray-900">
            Food Redistribution
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Donate surplus food to those in need
          </Text>
          <Pressable
            className="flex-row items-center justify-center bg-green-600 rounded-lg py-4 gap-2"
            onPress={() => console.log("Donate now")}
          >
            <Gift stroke="#FFF" width={24} height={24} />
            <Text className="text-white text-base font-semibold">
              Donate Now
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
