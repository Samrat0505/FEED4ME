import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Bug,
  Droplet,
  Leaf,
  Mail,
  MessageCircle,
  Phone,
  Thermometer,
} from "lucide-react-native";
import LucidIcons from "~/components/LucidIcons";

const ContactUs = () => {
  const data = [
    { icon: Leaf, title: "Crop Management" },
    { icon: Droplet, title: "Irrigation" },
    { icon: Bug, title: "Pest Control" },
    { icon: Thermometer, title: "Climate Control" },
  ];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="bg-gray-100"
    >
      <View className="pt-16 px-5">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black flex justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text className="text-3xl font-bold my-5 shadow-lg">
          Support Center
        </Text>
      </View>

      <View className="flex items-center justify-center flex-row flex-wrap pb-4">
        {data?.map((topic, index) => {
          return (
            <Pressable
              key={index}
              className="rounded-xl aspect-square m-1 flex items-center justify-center border border-muted bg-white w-[47%]"
            >
              <LucidIcons IconName={topic.icon} size={32} color="green" />
              <Text className="font-semibold py-2">{topic.title}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-2 px-3">
        Contact Support
      </Text>
      <View className="pb-3 px-3">
        {[
          {
            icon: MessageCircle,
            title: "Live Chat",
            subtitle: "Available 24/7",
          },
          {
            icon: Phone,
            title: "Phone Support",
            subtitle: "Mon-Fri, 9AM-6PM",
          },
          {
            icon: Mail,
            title: "Email Support",
            subtitle: "Reply within 24h",
          },
        ].map((contact, index) => (
          <Pressable
            key={index}
            className="bg-white p-5 rounded-xl flex-row items-center shadow-md my-1"
          >
            <View className="w-12 h-12 bg-green-100 rounded-full flex justify-center items-center">
              <LucidIcons IconName={contact.icon} color="green" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold text-gray-800">
                {contact.title}
              </Text>
              <Text className="text-sm text-gray-500">{contact.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default ContactUs;
