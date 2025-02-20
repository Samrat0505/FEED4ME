import * as React from "react";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import LucidIcons from "~/components/LucidIcons";
import { LayoutDashboardIcon, Sprout } from "lucide-react-native";

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

export default function Screen() {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardHeader className="items-center">
          <View className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
            <LucidIcons IconName={Sprout} size={50} />
          </View>
          <CardTitle className="pb-2 text-center">
            Authentication screen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem sint
            expedita deserunt adipisci.
          </Text>
        </CardContent>
      </Card>
      <Button
        onPress={() => router.push("/(root)/Dashboard")}
        variant={"outline"}
        className="flex flex-row items-center justify-center gap-2"
      >
        <LucidIcons IconName={LayoutDashboardIcon} />
        <Text>Dashboard</Text>
      </Button>
    </View>
  );
}
