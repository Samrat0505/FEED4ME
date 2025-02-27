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
    { icon: Droplet, title: "Irrigation Control" },
    { icon: Bug, title: "pesticides Control" },
    { icon: Thermometer, title: "Climate Control" },
  ];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-16 px-5">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 flex justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} />
        </Pressable>
        <Text className="text-3xl font-bold my-5 shadow-lg">
          Support Center
        </Text>
      </View>

      <View className="flex items-center justify-center flex-row flex-wrap pb-1">
        {data?.map((topic, index) => {
          return (
            <Pressable
              key={index}
              className="rounded-xl m-1 p-5 flex items-start justify-start border border-muted w-[45%]"
            >
              <LucidIcons IconName={topic.icon} size={30} strokeWidth={1.4} color="green" />
              <Text className="font-bold pt-2 text-xl">{topic.title}</Text>
            </Pressable>
          );
        })}
      </View>

      <View className="pb-3 px-4">
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
            className="p-2 px-4 flex-row items-center my-1 border border-muted rounded-xl"
          >
            <LucidIcons IconName={contact.icon} color="green" size={23} />
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold text-gray-800">
                {contact.title}
              </Text>
              <Text className="text-sm text-muted-foreground">{contact.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default ContactUs;
