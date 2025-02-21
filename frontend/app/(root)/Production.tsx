import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LucidIcons from "~/components/LucidIcons";
import { Droplet, Leaf, Sun } from "lucide-react-native";

const Production = () => {
  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-16 px-5">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black flex justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text className="text-3xl font-bold my-5 shadow-lg">
          Production Overview
        </Text>
      </View>

      <View className="px-3">
        <View className="flex-row justify-between mb-6">
          <View className="bg-white p-5 rounded-xl items-center w-[32%] shadow-md">
            <LucidIcons IconName={Leaf} size={24} color="#2E7D32" />

            <Text className="text-2xl font-bold text-green-800 mt-2">
              1,234
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Active Crops
            </Text>
          </View>
          <View className="bg-white p-5 rounded-xl items-center w-[32%] shadow-md">
            <LucidIcons IconName={Droplet} size={24} color="#2E7D32" />
            <Text className="text-2xl font-bold text-green-800 mt-2">87%</Text>
            <Text className="text-sm text-gray-500 text-center">
              Soil Health
            </Text>
          </View>
          <View className="bg-white p-5 rounded-xl items-center w-[32%] shadow-md">
            <LucidIcons IconName={Sun} size={24} color="#2E7D32" />
            <Text className="text-2xl font-bold text-green-800 mt-2">28°C</Text>
            <Text className="text-sm text-gray-500 text-center">
              Temperature
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-bold text-gray-800 mb-3 px-1">
          Active Fields
        </Text>
        <View>
          <View className="border border-muted bg-white px-3 py-3 my-1 rounded-lg">
            <Text className="text-xl font-semibold pb-2">Field no #857</Text>
            <Text>Status : Growing</Text>
          </View>
          <View className="border border-muted bg-white px-3 py-3 my-1 rounded-lg">
            <Text className="text-xl font-semibold pb-2">Field no #857</Text>
            <Text>Status : Cutting</Text>
          </View>
          <View className="border border-muted bg-white px-3 py-3 my-1 rounded-lg">
            <Text className="text-xl font-semibold pb-2">Field no #857</Text>
            <Text>Status : Empty</Text>
          </View>
          <View className="border border-muted bg-white px-3 py-3 my-1 rounded-lg">
            <Text className="text-xl font-semibold pb-2">Field no #857</Text>
            <Text>Status : Empty</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Production;
