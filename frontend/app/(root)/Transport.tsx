import { View, Text, ScrollView, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LucidIcons from "~/components/LucidIcons";
import { MapPin, Truck } from "lucide-react-native";
const Transport = () => {
  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-16 px-5">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black flex justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text className="text-3xl font-bold my-5 shadow-lg">Transport Hub</Text>
      </View>

      <View className="flex-row justify-between px-3">
        {[
          { value: "12", label: "Active Routes" },
          { value: "8", label: "Vehicles" },
          { value: "95%", label: "On Time" },
        ].map((stat, index) => (
          <View
            key={index}
            className="bg-white p-5 rounded-xl items-center w-[32%] shadow-md"
          >
            <Text className="text-2xl font-bold text-green-800 mt-2">
              {stat.value}
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <View className="p-3">
        <Text className="text-2xl font-bold text-gray-800 mb-3 px-1">
          Active Deliveries
        </Text>
        {[1, 2, 3].map((delivery) => (
          <Pressable
            key={delivery}
            className="bg-white p-5 rounded-xl my-1 shadow-md"
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <LucidIcons IconName={Truck} size={24} color="green" />
                <Text className="text-lg font-bold ml-3 text-gray-800">
                  Delivery #{delivery}001
                </Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 font-bold text-sm">
                  In Transit
                </Text>
              </View>
            </View>
            <View>
              <View className="flex items-center justify-start flex-row gap-2">
                <LucidIcons IconName={MapPin} />
                <View className="flex items-start justify-start gap-1">
                  <Text>From</Text>
                  <Text className="font-semibold">Storage Unit 5</Text>
                </View>
              </View>
              <View className="w-[2px] h-9 m-1 bg-black rounded-full" />

              <View className="flex items-center justify-start flex-row gap-2">
                <LucidIcons IconName={MapPin} />
                <View className="flex items-start justify-start gap-1">
                  <Text>To</Text>
                  <Text className="font-semibold">Distribution center 8</Text>
                </View>
              </View>
            </View>

            <View className="mt-5">
              <Text className=" text-gray-600">ETA: 2h 30m</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default Transport;
