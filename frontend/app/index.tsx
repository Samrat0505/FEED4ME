import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "~/components/ui/text";

export default function Screen() {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <View className="flex justify-center items-center gap-3 flex-row p-6">
        <ActivityIndicator animating />
        <Text>Please wait...</Text>
      </View>
    </View>
  );
}
