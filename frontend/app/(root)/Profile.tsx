import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { HeartPulse, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LucidIcons from "~/components/LucidIcons";
import { useGlobalContext } from "~/Context/ContextProvider";
import { getFarmerProfile } from "~/lib/Api";

const ProfileScreen = () => {
  const { user, setUser } = useGlobalContext();
  const [userData, setUserData] = useState<{
    age: string;
    crops: [];
    customers: [];
    email: string;
    location: string;
    name: string;
  } | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const data = await getFarmerProfile(user.token);
      if (data) {
        setUserData(data.data);
        setisLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <View className="items-center">
        <Image
          source={{
            uri: "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg",
          }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-xl font-bold text-gray-900">
          {user.user.name}
        </Text>
        <Text className="text-gray-600">{user.user.email}</Text>
      </View>
      <TouchableOpacity
        className="mt-5 bg-red-500 p-3 rounded-lg"
        onPress={() => {
          setUser(null);
          AsyncStorage.removeItem("user");
          router.replace("/MainScreen");
        }}
      >
        <Text className="text-white text-center font-semibold">Log Out</Text>
      </TouchableOpacity>

      <View className="mt-6 p-4 border border-muted rounded-lg bg-gray-50 flex-row justify-between">
        <View className="flex-row gap-2 item-center">
          <LucidIcons IconName={HeartPulse} />
          <Text className="text-gray-700"> {user.user.age}</Text>
        </View>
        <View className="flex-row gap-2 item-center">
          <LucidIcons IconName={MapPin} />
          <Text className="text-gray-700">{user.user.location}</Text>
        </View>
      </View>
      <View className="my-5">
        {isLoading ? (
          <View className="flex flex-row gap-2 justify-center">
            <ActivityIndicator animating />
            <Text>Loading crops and customers...</Text>
          </View>
        ) : (
          <View>
            <Text>Crops : {JSON.stringify(userData?.crops)}</Text>
            <Text>Customers : {JSON.stringify(userData?.customers)}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
