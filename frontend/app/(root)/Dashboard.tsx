// import {
//   View,
//   Text,
//   StatusBar,
//   ScrollView,
//   useWindowDimensions,
// } from "react-native";
// import React from "react";
// import LucidIcons from "~/components/LucidIcons";
// import {
//   CloudSunIcon,
//   Leaf,
//   LucideIcon,
//   MapPin,
//   Sun,
//   Truck,
//   Utensils,
//   Warehouse,
// } from "lucide-react-native";

import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LucidIcons from "~/components/LucidIcons";
import {
  Box,
  CloudSunIcon,
  Info,
  Leaf,
  LucideIcon,
  MapPin,
  Sun,
  Trash2,
  Truck,
  Users,
  Utensils,
} from "lucide-react-native";

const Dashboard = () => {
  const CardItems: { name: string; icon: LucideIcon; route: string }[] = [
    { name: "Production", icon: Leaf, route: "/(root)/Production" },
    { name: "Support", icon: Users, route: "/(root)/ContactUs" },
    { name: "Storage", icon: Box, route: "/(root)/Storage" },
    { name: "Transportation", icon: Truck, route: "/(root)/Transport" },
    { name: "Wastage", icon: Trash2, route: "/(root)/Waste" },
    { name: "About", icon: Info, route: "/(root)/About" },
  ];
  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ paddingTop: StatusBar.currentHeight }}
      showsVerticalScrollIndicator={false}
    >
      <View className="border border-muted bg-white p-3 rounded-xl m-2">
        <View className="flex items-center justify-start flex-row gap-2">
          <LucidIcons IconName={MapPin} />
          <Text>Pantnagar Uttarakhand - 246171</Text>
        </View>
        <Text className="p-2 text-muted-foreground text-sm">
          Toady 30 feb 2025
        </Text>
        <View className="flex justify-between items-start flex-row flex-wrap">
          <View className="flex items-start justify-start flex-row gap-2 p-2">
            <Text className="text-7xl font-semibold">21</Text>
            <Text>*C</Text>
          </View>
          <View className="flex items-start justify-start flex-row gap-2 px-2">
            <LucidIcons IconName={CloudSunIcon} />
            <Text>Mostly cloudy</Text>
          </View>
        </View>
        <Text className="pb-2">Hourly forcast</Text>
        <ScrollView
          horizontal={true}
          contentContainerClassName="flex justify-between items-start flex-row flex-wrap bg-secondary/30 my-2 gap-3"
        >
          <View className="flex justify-center items-center flex-wrap m-1 rounded-xl">
            <LucidIcons IconName={Sun} size={25} strokeWidth={1.5} />
            <Text className="text-sm pt-1">8:00 AM</Text>
            <Text className=" text-xl">19*</Text>
          </View>
          <View className="flex justify-center items-center flex-wrap m-1 rounded-xl">
            <LucidIcons IconName={Sun} size={25} strokeWidth={1.5} />
            <Text className="text-sm pt-1">9:00 AM</Text>
            <Text className="text-xl">19*</Text>
          </View>
          <View className="flex justify-center items-center flex-wrap m-1 rounded-xl">
            <LucidIcons IconName={Sun} size={25} strokeWidth={1.5} />
            <Text className="text-sm pt-1">10:00 AM</Text>
            <Text className=" text-xl">19*</Text>
          </View>
          <View className="flex justify-center items-center flex-wrap m-1 rounded-xl">
            <LucidIcons IconName={Sun} size={25} strokeWidth={1.5} />
            <Text className="text-sm pt-1">11:00 AM</Text>
            <Text className="text-xl">19*</Text>
          </View>
        </ScrollView>
      </View>

      {/* <View className="flex-row justify-between m-2">
        <View className="bg-white p-5 rounded-xl items-center w-[32%]">
          <Text className="text-2xl font-bold text-green-800">1.2K</Text>
          <Text className="text-sm text-gray-500">Farmers</Text>
        </View>
        <View className="bg-white p-5 rounded-xl items-center w-[32%]">
          <Text className="text-2xl font-bold text-green-800">450</Text>
          <Text className="text-sm text-gray-500 text-center">
            Storage Units
          </Text>
        </View>
        <View className="bg-white p-5 rounded-xl items-center w-[32%]">
          <Text className="text-2xl font-bold text-green-800">2.5T</Text>
          <Text className="text-sm text-gray-500 text-center">Food Saved</Text>
        </View>
      </View> */}

      <View className="flex items-center justify-center flex-row flex-wrap pb-4">
        {CardItems?.map((item, index) => {
          return (
            <Pressable
              onPress={() => router.push(item.route)}
              key={index}
              className="rounded-xl aspect-square m-1 flex items-center justify-center border border-muted bg-white w-[47%]"
            >
              <LucidIcons
                IconName={item.icon}
                size={50}
                strokeWidth={1.4}
                color="green"
              />
              <Text className="font-semibold py-2">{item.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
