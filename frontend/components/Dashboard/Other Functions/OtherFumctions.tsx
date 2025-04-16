import { View, Text, Pressable } from "react-native";
import React from "react";
import { Route, router } from "expo-router";
import {
  Box,
  CircleDollarSign,
  CloudSunIcon,
  Info,
  Leaf,
  LucideIcon,
  LucideLeafyGreen,
  MapPin,
  Recycle,
  Sun,
  Truck,
  User,
  Users,
  Warehouse,
} from "lucide-react-native";
import LucidIcons from "~/lib/LucidIcons";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "~/Context/ContextProvider";
import { cn } from "~/lib/utils";

const OtherFumctions = () => {
  const { user } = useGlobalContext();
  const CardItems: {
    name: string;
    icon: LucideIcon;
    route: string | null;
    description: string;
  }[] = [
    {
      name: "Production",
      icon: Leaf,
      route:
        user?.user.role === "farmer" ? "/(root)/(Production)/Production" : null,
      description: "Crop Management",
    },
    {
      name: "Storage",
      icon: Box,
      route: "/(root)/Storage",
      description: "Manage Storage",
    },
    {
      name: "Purchase",
      icon: CircleDollarSign,
      route: "/(root)/Purchase",
      description: "Track Purchases",
    },
    {
      name: "Wastage",
      icon: Recycle,
      route: "/(root)/(Wastage)/Waste",
      description: "Reduce Waste",
    },
    {
      name: "Support",
      icon: Users,
      route: "/(root)/Support",
      description: "Guidance and Assistance",
    },
    {
      name: "About",
      icon: Info,
      route: "/(root)/About",
      description: "Our mission and goals",
    },
  ];
  const { t } = useTranslation();

  return (
    <View className="flex items-center justify-center flex-row flex-wrap pb-4">
      {CardItems?.map((item, index) => {
        return (
          <Pressable
            onPress={() => item.route && router.push(item.route as Route)}
            key={index}
            className={cn(
              "rounded-xl m-1 p-5 flex items-start justify-start border border-muted w-[45%]",
              !item.route && "opacity-30"
            )}
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
  );
};

export default OtherFumctions;
