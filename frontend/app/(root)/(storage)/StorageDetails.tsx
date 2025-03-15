import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

const StorageDetails = () => {
  const { storageId, storageName } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: `${storageName}` }} />
      <Text>{storageId}</Text>
    </View>
  );
};

export default StorageDetails;
