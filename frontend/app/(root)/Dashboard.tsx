import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  HandshakeIcon,
  LucideLeafyGreen,
  Newspaper,
  User,
  Warehouse,
} from "lucide-react-native";
import { useGlobalContext } from "~/Context/ContextProvider";
import { useTranslation } from "react-i18next";
import LucidIcons from "~/lib/LucidIcons";
import WeatherCard from "~/components/Dashboard/WeatherCard";
import NgoFunctions from "~/components/Dashboard/Other Functions/NgoFunctions";
import OtherFumctions from "~/components/Dashboard/Other Functions/OtherFumctions";

const Dashboard = () => {
  const { user } = useGlobalContext();
  const { t } = useTranslation();

  const getRoleDetails = () => {
    switch (user?.user?.role.toLowerCase()) {
      case "farmer":
        return {
          title: "Farmer Dashboard",
          description:
            "Efficiently manage your crops, monitor inventory, and discover nearby storage facilities.",
        };
      case "customer":
        return {
          title: "Customer Hub",
          description:
            "Browse a variety of crops, make purchases, and connect directly with farmers.",
        };
      case "storage":
        return {
          title: "Storage Manager Portal",
          description:
            "Oversee inventory storage, track stock levels, and assist farmers with secure storage solutions.",
        };
      case "ngo":
        return {
          title: "NGO Center",
          description:
            "Support sustainable agriculture by connecting with farmers and facilitating food distribution efforts.",
        };
      default:
        return {
          title: "Welcome to Feed4Me!",
          description:
            "Explore our platform to manage your agricultural needs.",
        };
    }
  };

  const AVATAR_URI =
    "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";
  if (user.user.role === "ngo") {
    return (
      <NgoFunctions
        HeaderComponent={() => (
          <View style={{ paddingTop: StatusBar.currentHeight }}>
            <View className="flex item-center justify-between flex-row p-3 m-2 rounded-xl">
              <Pressable
                onPress={() => router.push("/(root)/Profile")}
                className="flex item-center justify-between flex-row gap-5"
              >
                <Image
                  source={{ uri: AVATAR_URI }}
                  className="h-14 w-14 rounded-full p-3"
                />
                <View className="flex item-center justify-start">
                  <Text className="text-muted-foreground text-sm">
                    {t("Welcome back")}
                  </Text>
                  <Text className="text-xl font-semibold">
                    {t(user.user?.name)}
                  </Text>
                </View>
              </Pressable>
              <View className="flex items-center justify-center flex-row gap-3">
                <Pressable onPress={() => router.push("/(root)/NewsFeed")}>
                  <LucidIcons IconName={Newspaper} size={20} />
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      t(getRoleDetails().title),
                      t(getRoleDetails().description)
                    )
                  }
                  className="bg-slate-50rounded-full p-3 w-[40] h-[40] flex item-center justify-center"
                >
                  <LucidIcons
                    IconName={
                      user?.user?.role === "customer"
                        ? User
                        : user?.user?.role === "storage"
                        ? Warehouse
                        : user?.user?.role === "ngo"
                        ? HandshakeIcon
                        : LucideLeafyGreen
                    }
                    size={20}
                    color="green"
                  />
                </Pressable>
              </View>
            </View>
            <WeatherCard
              latitude={user?.user.location.coordinates.coordinates[0]}
              longitude={user?.user.location.coordinates.coordinates[1]}
            />
            <Text className="px-4 py-2 text-xl">Waste Report List</Text>
          </View>
        )}
      />
    );
  }
  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: StatusBar.currentHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex item-center justify-between flex-row p-3 m-2 rounded-xl">
          <Pressable
            onPress={() => router.push("/(root)/Profile")}
            className="flex item-center justify-between flex-row gap-5"
          >
            <Image
              source={{ uri: AVATAR_URI }}
              className="h-14 w-14 rounded-full p-3"
            />
            <View className="flex item-center justify-start">
              <Text className="text-muted-foreground text-sm">
                {t("Welcome back")}
              </Text>
              <Text className="text-xl font-semibold">
                {t(user.user?.name)}
              </Text>
            </View>
          </Pressable>
          <View className="flex items-center justify-center flex-row gap-3">
            <Pressable onPress={() => router.push("/(root)/NewsFeed")}>
              <LucidIcons IconName={Newspaper} size={20} />
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert(
                  t(getRoleDetails().title),
                  t(getRoleDetails().description)
                )
              }
              className="bg-slate-50rounded-full p-3 w-[40] h-[40] flex item-center justify-center"
            >
              <LucidIcons
                IconName={
                  user?.user?.role === "customer"
                    ? User
                    : user?.user?.role === "storage"
                    ? Warehouse
                    : user?.user?.role === "ngo"
                    ? HandshakeIcon
                    : LucideLeafyGreen
                }
                size={20}
                color="green"
              />
            </Pressable>
          </View>
        </View>

        <WeatherCard
          latitude={user?.user.location.coordinates.coordinates[0]}
          longitude={user?.user.location.coordinates.coordinates[1]}
        />
        <OtherFumctions />
      </ScrollView>
    </>
  );
};

export default Dashboard;
