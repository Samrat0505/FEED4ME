import { View, Text, ScrollView, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Sprout } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import LucidIcons from "~/lib/LucidIcons";

const About = () => {
  const { t } = useTranslation();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        className="flex-1 p-3"
        style={{ paddingTop: StatusBar.currentHeight }}
      >
        <View className="items-center mb-6">
          <View className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center my-5">
            <LucidIcons IconName={Sprout} size={80} strokeWidth={1} />
          </View>
          <Text className="text-3xl font-bold text-gray-800">
            {t("FEED4ME")}
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            {t("From Seed to Soul")}
          </Text>
        </View>

        <View className="p-4 rounded-xl mb-2 border border-muted ">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {t("Our Mission")}
          </Text>
          <Text className="text-gray-600">
            {t(
              "FEED4ME is a technology-driven platform optimizing the food supply chain from production to waste management. We empower farmers, streamline logistics, and minimize food wastage through innovation."
            )}
          </Text>
        </View>

        <View className="p-4 rounded-xl mb-2 border border-muted ">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {t("Key Features")}
          </Text>
          {[
            { icon: "leaf", title: "Production Assistance" },
            { icon: "cube", title: "Storage Management" },
            { icon: "car", title: "Goods Transportation" },
            { icon: "trash", title: "Waste Management" },
          ].map((feature, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons
                name={feature.icon}
                size={20}
                color="#2E7D32"
                className="mr-4"
              />
              <Text>{t(feature.title)}</Text>
            </View>
          ))}
        </View>

        <View className="p-4 rounded-xl mb-2 border border-muted ">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {t("Our Vision")}
          </Text>
          <Text className="text-gray-600">
            {t(
              "We envision a sustainable food ecosystem where farmers, businesses, and consumers benefit from efficient technology, real-time data, and smart logistics to ensure food security and environmental responsibility."
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default About;
