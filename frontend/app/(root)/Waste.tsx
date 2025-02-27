import { View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import React from "react";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import LucidIcons from "~/components/LucidIcons";
import { InfoIcon } from "lucide-react-native";

const Waste = () => {
  return (
    <ScrollView className="flex-1">
      <View className="pt-16 px-5">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 flex justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} />
        </Pressable>
        <Text className="text-3xl font-bold my-5 shadow-lg">
          Waste Management
        </Text>
      </View>

      <View className="flex item-center justify-center p-5 rounded-xl border border-muted my-1 mx-3 flex-row gap-3">
        <LucidIcons IconName={InfoIcon} />
        <Text className="text-xl font-bold">
          Report Food Waste
        </Text>
      </View>


      <View className="p-5 rounded-xl my-1 border border-muted mx-3">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          Nearby NGO Partnerships
        </Text>
        {[
          "Food Rescue Org",
          "Green Earth Initiative",
          "Zero Hunger Project",
        ].map((ngo, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between py-3"
          >
            <Text className="text-lg text-gray-700">{ngo}</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        ))}
      </View>

      <View className="p-5 rounded-xl my-1 border border-muted mx-3">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Food Redistribution
        </Text>
        <Text className="text-gray-600 mb-3">
          Donate surplus food to those in need
        </Text>
        <Pressable className="bg-green-600 py-3 rounded-lg flex-row items-center justify-center">
          <Ionicons name="gift" size={24} color="#fff" className="mr-2" />
          <Text className="text-white text-lg font-bold">Donate Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Waste;
