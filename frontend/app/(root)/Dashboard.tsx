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
} from "react-native";
import { Route, router } from "expo-router";
import LucidIcons from "~/components/LucidIcons";
import {
  Box,
  CloudSunIcon,
  Info,
  Leaf,
  LucideIcon,
  MapPin,
  Recycle,
  Sun,
  Truck,
  Users,
} from "lucide-react-native";
import { useGlobalContext } from "~/Context/ContextProvider";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const CardItems: {
    name: string;
    icon: LucideIcon;
    route: string;
    description: string;
  }[] = [
    {
      name: "Production",
      icon: Leaf,
      route: "/(root)/Production",
      description: "Crop Management",
    },
    {
      name: "Storage",
      icon: Box,
      route: "/(root)/Storage",
      description: "Manage Storage",
    },
    {
      name: "Transportation",
      icon: Truck,
      route: "/(root)/Transport",
      description: "Track Deliveries",
    },
    {
      name: "Wastage",
      icon: Recycle,
      route: "/(root)/Waste",
      description: "Reduce Waste",
    },
    {
      name: "Support",
      icon: Users,
      route: "/(root)/ContactUs",
      description: "Guidance and Assistance",
    },
    {
      name: "About",
      icon: Info,
      route: "/(root)/About",
      description: "Our mission and goals",
    },
  ];

  const AVATAR_URI =
    "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

  const { user } = useGlobalContext();
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: StatusBar.currentHeight }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.push("/(root)/Profile")}
        className="flex item-center justify-between flex-row p-3 m-2 rounded-xl"
      >
        <View className="flex item-center justify-between flex-row gap-5">
          <Image
            source={{ uri: AVATAR_URI }}
            className="h-14 w-14 rounded-full p-3"
          />
          <View className="flex item-center justify-start">
            <Text className="text-muted-foreground text-sm">
              {t("Welcome back")}
            </Text>
            <Text className="text-xl font-semibold">{t(user.user?.name)}</Text>
          </View>
        </View>
        {/* <Pressable className="bg-slate-50rounded-full p-3 w-[40] h-[40] flex item-center justify-center">
          <LucidIcons IconName={LucideLeafyGreen} size={20} color="green" />
        </Pressable> */}
      </Pressable>

      <View className="border border-muted p-3 rounded-xl m-2 mx-5">
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

      <View className="flex items-center justify-center flex-row flex-wrap pb-4">
        {CardItems?.map((item, index) => {
          return (
            <Pressable
              onPress={() => router.push(item.route as Route)}
              key={index}
              className="rounded-xl m-1 p-5 flex items-start justify-start border border-muted w-[45%]"
            >
              <LucidIcons
                IconName={item.icon}
                size={30}
                strokeWidth={1.4}
                color="green"
              />

              <Text className="font-bold pt-2 text-xl">{t(item.name)}</Text>
              <Text className="text-muted-foreground text-sm text-wrap pr-5">
                {t(item.description)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
