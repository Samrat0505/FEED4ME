import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import LucidIcons from "~/components/LucidIcons";
import { LayoutDashboardIcon, ScreenShare, Sprout } from "lucide-react-native";
import { socket } from "../socket";
import { useEffect, useState } from "react";

export default function Screen() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("new user connected :", socket.id);
    });

    socket.on("testing", (data) => {
      console.log(data);
    });
  }, []);

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <View className="flex justify-center items-center gap-3 flex-row p-6">
        <ActivityIndicator animating />
        <Text>Please wait...</Text>
      </View>
    </View>
  );
}
