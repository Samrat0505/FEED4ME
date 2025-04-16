import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  BookOpen,
  Bug,
  DollarSign,
  Droplet,
  Leaf,
  Mail,
  MessageCircle,
  Phone,
  Thermometer,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import LucidIcons from "~/lib/LucidIcons";

const Support = () => {
  const { t } = useTranslation();
  const data = [
    {
      icon: BookOpen,
      title: "Training",
      description: "videos of related field (Youtube Videos)",
    },
    {
      icon: DollarSign,
      title: "Loans",
      description: "Get loan with low interst rate",
    },
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex items-center justify-center flex-row flex-wrap pb-1">
        {data?.map((topic, index) => {
          return (
            <Pressable
              key={index}
              className="rounded-xl m-1 p-5 flex items-start justify-start border border-muted w-[45%]"
            >
              <LucidIcons
                IconName={topic.icon}
                size={30}
                strokeWidth={1.4}
                color="green"
              />
              <Text className="font-bold pt-2 text-xl">{t(topic.title)}</Text>
              <Text className="text-sm text-muted-foreground">
                {topic.description}
              </Text>
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
                {t(contact.title)}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {t(contact.subtitle)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default Support;
