import { View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import React from "react";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import LucidIcons from "~/components/LucidIcons";
import { InfoIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

const Waste = () => {
  const { t } = useTranslation();
  return (
    <ScrollView className="flex-1">
      <View className="flex item-center justify-center p-5 rounded-xl border border-muted my-1 mx-3 flex-row gap-3">
        <LucidIcons IconName={InfoIcon} />
        <Text className="text-xl font-bold">{t("Report Food Waste")}</Text>
      </View>

      <View className="p-5 rounded-xl my-1 border border-muted mx-3">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          {t("Nearby NGO Partnerships")}
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
            <Text className="text-lg text-gray-700">{t(ngo)}</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        ))}
      </View>

      <View className="p-5 rounded-xl my-1 border border-muted mx-3">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          {t("Food Redistribution")}
        </Text>
        <Text className="text-gray-600 mb-3">
          {t("Donate surplus food to those in need")}
        </Text>
        <Pressable className="bg-green-600 py-3 rounded-lg flex-row items-center justify-center">
          <Ionicons name="gift" size={24} color="#fff" className="mr-2" />
          <Text className="text-white text-lg font-bold">
            {t("Donate Now")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Waste;
