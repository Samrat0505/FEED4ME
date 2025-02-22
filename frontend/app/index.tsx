import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import LucidIcons from "~/components/LucidIcons";
import { LayoutDashboardIcon, ScreenShare, Sprout } from "lucide-react-native";

export default function Screen() {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">

      {/* <View className="flex justify-center items-center gap-3 flex-row p-6">
        <ActivityIndicator animating />
        <Text>Please wait...</Text>
      </View> */}

      <Button

        onPress={() => router.push("/(root)/Dashboard")}
        variant={"outline"}
        className="flex flex-row items-center justify-center gap-2"
      >
        <LucidIcons IconName={LayoutDashboardIcon} />
        <Text>Dashboard</Text>
      </Button>

      <Button
        onPress={() => router.push("/MainScreen")}
        variant={"outline"}
        className="flex flex-row items-center justify-center gap-2"
      >
        <LucidIcons IconName={ScreenShare} />
        <Text>Auth screen</Text>
      </Button>

    </View>
  );
}
