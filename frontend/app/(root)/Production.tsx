import { View, Text, ScrollView, Image, Pressable } from "react-native";
import LucidIcons from "~/components/LucidIcons";
import { Droplet, Leaf, Sun } from "lucide-react-native";

const Production = () => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-3">
        <View className="flex-row justify-between mb-6">
          <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
            <LucidIcons IconName={Leaf} size={24} color="#2E7D32" />

            <Text className="text-2xl font-bold text-green-800 mt-2">
              1,234
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Active Crops
            </Text>
          </View>
          <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
            <LucidIcons IconName={Droplet} size={24} color="#2E7D32" />
            <Text className="text-2xl font-bold text-green-800 mt-2">87%</Text>
            <Text className="text-sm text-gray-500 text-center">
              Soil Health
            </Text>
          </View>
          <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
            <LucidIcons IconName={Sun} size={24} color="#2E7D32" />
            <Text className="text-2xl font-bold text-green-800 mt-2">28°C</Text>
            <Text className="text-sm text-gray-500 text-center">
              Temperature
            </Text>
          </View>
        </View>

        <Text className="text-xl font-semibold mb-3 px-1">Active Fields</Text>
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
