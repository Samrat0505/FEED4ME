// import { View, Text, ScrollView, Pressable } from "react-native";
// import { router, Stack } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import LucidIcons from "~/components/LucidIcons";
// import { Box } from "lucide-react-native";
import MapScreen from "~/components/MapScreen";
const Storage = () => {
  return (
    // <ScrollView className="flex-1">
    //   <View className="pt-16 px-5">
    //     <Pressable
    //       onPress={() => router.back()}
    //       className="w-10 h-10 rounded-full bg-slate-100 flex justify-center items-center"
    //     >
    //       <Ionicons name="arrow-back" size={24} />
    //     </Pressable>
    //     <Text className="text-3xl font-bold my-5 shadow-lg">
    //       Storage Management
    //     </Text>
    //   </View>

    //   <View className="flex-row justify-between px-3">
    //     {[
    //       { value: "75%", label: "Capacity Used" },
    //       { value: "23°C", label: "Avg. Temp" },
    //       { value: "45%", label: "Humidity" },
    //     ].map((stat, index) => (
    //       <View
    //         key={index}
    //         className="p-5 rounded-xl items-center w-[32%] border border-muted"
    //       >
    //         <Text className="text-2xl font-bold text-green-800 mt-2">
    //           {stat.value}
    //         </Text>
    //         <Text className="text-sm text-gray-500 text-center">
    //           {stat.label}
    //         </Text>
    //       </View>
    //     ))}
    //   </View>

    //   <View className="px-3 mt-3">
    //     <Text className="text-xl font-semibold text-gray-800 mb-1 px-1">
    //       Storage Units
    //     </Text>
    //     {[1, 2, 3].map((unit) => (
    //       <Pressable key={unit} className="p-5 rounded-xl my-1 border border-muted">
    //         <View className="flex-row justify-between items-center my-1">
    //           <View className="flex-row items-center">
    //             <LucidIcons IconName={Box} size={24} color="green" />
    //             <Text className="text-lg font-bold ml-3 text-gray-800">
    //               Storage Unit {unit}
    //             </Text>
    //           </View>
    //           <View className="bg-green-100 px-3 py-1 rounded-full">
    //             <Text className="text-green-700 font-bold text-sm">Active</Text>
    //           </View>
    //         </View>
    //         <View className="space-y-2 mt-2">
    //           <Text className="text-sm text-gray-600">Capacity: 80% Full</Text>
    //           <View className="h-2 bg-gray-300 rounded-full my-1">
    //             <View className="h-full bg-green-700 rounded-full w-4/5" />
    //           </View>
    //           <View className="flex-row justify-between">
    //             <Text className="text-sm text-gray-600">Temperature: 22°C</Text>
    //             <Text className="text-sm text-gray-600">Humidity: 45%</Text>
    //           </View>
    //         </View>
    //       </Pressable>
    //     ))}
    //   </View>
    // </ScrollView>
    <MapScreen />
  );
};

export default Storage;
