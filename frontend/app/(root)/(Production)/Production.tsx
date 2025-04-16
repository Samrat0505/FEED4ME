import { View, Text, Pressable, RefreshControl } from "react-native";
import {
  IndianRupee,
  PackageCheck,
  Sprout,
  UserIcon,
} from "lucide-react-native";
import LucidIcons from "~/lib/LucidIcons";
import { Button } from "~/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { PurchaseHistory, User } from "~/lib/Types";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "~/Context/ContextProvider";
import { getFarmerCustomers, getFarmerProfile } from "~/lib/Api";
import TabComponent from "~/components/TabComponent";
import { router } from "expo-router";
import { Crops } from "~/lib/constants";
import { FlatList } from "react-native-gesture-handler";
import { cn } from "~/lib/utils";
// interface Field {
//   id: string;
//   status: string;
//   crop: string;
//   area: string;
//   lastAction: string;
//   plantedDate: string;
//   harvestDate: string;
//   cropHealth: number;
//   waterUsage: string;
//   yieldForecast: string;
//   soilMoisture: string;
//   pestRisk: string;
//   windExposure: string;
//   alerts: string[];
//   daysToHarvest: number | null;
// }
// const fields: Field[] = [
//   {
//     id: "857",
//     status: "Growing",
//     crop: "Wheat",
//     area: "12.5 ha",
//     lastAction: "Fertilized 2 days ago",
//     plantedDate: "Feb 15, 2025",
//     harvestDate: "Jun 20, 2025",
//     cropHealth: 92,
//     waterUsage: "125 L/day",
//     yieldForecast: "4.2 tons/ha",
//     soilMoisture: "68%",
//     pestRisk: "Low",
//     windExposure: "Medium",
//     alerts: [],
//     daysToHarvest: 89,
//   },
//   {
//     id: "858",
//     status: "Cutting",
//     crop: "Corn",
//     area: "8.3 ha",
//     lastAction: "Harvesting in progress",
//     plantedDate: "Mar 10, 2025",
//     harvestDate: "Today",
//     cropHealth: 85,
//     waterUsage: "180 L/day",
//     yieldForecast: "5.8 tons/ha",
//     soilMoisture: "72%",
//     pestRisk: "Medium",
//     windExposure: "Low",
//     alerts: ["Harvesting equipment maintenance needed"],
//     daysToHarvest: 0,
//   },
// ];

const Production = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [customerData, setCustomerData] = useState<PurchaseHistory[]>([]);
  const [customerLoading, setCustomerLoading] = useState<boolean>(true);
  const { t, i18n } = useTranslation();
  const { user } = useGlobalContext();

  // function FieldCard({ field }: { field: Field }) {
  //   const getStatusColor = (status: string) => {
  //     switch (status) {
  //       case "Growing":
  //         return { backgroundColor: "green" };
  //       case "Cutting":
  //         return { backgroundColor: "orange" };
  //       case "Empty":
  //         return { backgroundColor: "gray" };
  //       default:
  //         return { backgroundColor: "blue" };
  //     }
  //   };

  //   return (
  //     <View
  //       style={{
  //         overflow: "hidden",
  //         backgroundColor: "white",
  //         borderRadius: 8,
  //         marginBottom: 12,
  //       }}
  //       className="border border-muted"
  //     >
  //       <View style={{ position: "relative" }}>
  //         <View
  //           style={{
  //             height: 6,
  //             ...getStatusColor(field.status),
  //           }}
  //         />

  //         <View style={{ padding: 16 }}>
  //           <View
  //             style={{ flexDirection: "row", justifyContent: "space-between" }}
  //           >
  //             <View>
  //               <Text
  //                 style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
  //               >
  //                 Field #{field.id}
  //               </Text>

  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   alignItems: "center",
  //                   marginTop: 8,
  //                 }}
  //               >
  //                 <Sprout color="green" size={16} />
  //                 <Text style={{ marginLeft: 4 }}>{field.crop}</Text>

  //                 <Text style={{ marginHorizontal: 6 }}>•</Text>

  //                 <Leaf color="green" size={16} />
  //                 <Text style={{ marginLeft: 4 }}>{field.area}</Text>

  //                 {field.daysToHarvest !== null && (
  //                   <>
  //                     <Text style={{ marginHorizontal: 6 }}>•</Text>
  //                     <Timer color="orange" size={16} />
  //                     <Text style={{ marginLeft: 4 }}>
  //                       {field.daysToHarvest === 0
  //                         ? "Harvest day"
  //                         : `${field.daysToHarvest} days to harvest`}
  //                     </Text>
  //                   </>
  //                 )}
  //               </View>
  //             </View>

  //             <Button variant="ghost" size="icon">
  //               <MoreVertical size={20} />
  //             </Button>
  //           </View>

  //           {field.alerts.length > 0 && (
  //             <View
  //               style={{
  //                 marginTop: 10,
  //                 padding: 10,
  //                 backgroundColor: "#FEF3C7",
  //                 borderRadius: 6,
  //                 borderWidth: 1,
  //                 borderColor: "#FBBF24",
  //               }}
  //             >
  //               {field.alerts.map((alert: string, i: number) => (
  //                 <Text key={i} style={{ color: "#92400E", fontSize: 14 }}>
  //                   {alert}
  //                 </Text>
  //               ))}
  //             </View>
  //           )}
  //         </View>

  //         <View style={{ padding: 16, backgroundColor: "#F3F4F6" }}>
  //           <View
  //             style={{ flexDirection: "row", justifyContent: "space-between" }}
  //           >
  //             <View>
  //               <View style={{ flexDirection: "row", alignItems: "center" }}>
  //                 <Calendar color="gray" size={16} />
  //                 <Text style={{ marginLeft: 6, color: "#555" }}>
  //                   Planted: {field.plantedDate}
  //                 </Text>
  //               </View>

  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   alignItems: "center",
  //                   marginTop: 4,
  //                 }}
  //               >
  //                 <Timer color="gray" size={16} />
  //                 <Text style={{ marginLeft: 6, color: "#555" }}>
  //                   Harvest: {field.harvestDate}
  //                 </Text>
  //               </View>
  //             </View>

  //             {field.status !== "Empty" && (
  //               <View>
  //                 <View style={{ flexDirection: "row", alignItems: "center" }}>
  //                   <Droplets color="gray" size={16} />
  //                   <Text style={{ marginLeft: 6, color: "#555" }}>
  //                     Water: {field.waterUsage}
  //                   </Text>
  //                 </View>
  //                 <View
  //                   style={{
  //                     flexDirection: "row",
  //                     alignItems: "center",
  //                     marginTop: 4,
  //                   }}
  //                 >
  //                   <TrendingUp color="gray" size={16} />
  //                   <Text style={{ marginLeft: 6, color: "#555" }}>
  //                     Yield: {field.yieldForecast}
  //                   </Text>
  //                 </View>
  //               </View>
  //             )}
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // }

  useEffect(() => {
    fetchUserData();
    fetchCustomers();
  }, [user]);

  const fetchCustomers = async () => {
    setCustomerLoading(true);
    const data = await getFarmerCustomers(user.token);
    setCustomerLoading(false);
    setCustomerData(data);
  };

  const fetchUserData = async () => {
    if (user?.user.role === "farmer") {
      const data = await getFarmerProfile(user.token);
      if (data) {
        setUserData(data);
        setisLoading(false);
      }
    } else {
      setisLoading(false);
    }
  };

  const tabsData = useMemo(() => {
    return [
      { name: t("Crops") },
      // { name: t("Fields") },
      { name: t("Customers") },
    ];
  }, [i18n.language]);

  const getCropEmoji = (name: string) => {
    const crop = Crops.find(
      (crop) => crop.name.toLowerCase() === name.toLowerCase()
    );
    return crop ? crop.emoji : "🌱";
  };

  const renderItem = ({
    item,
  }: {
    item: { name: string; MRP: string; stock: string };
  }) => {
    return (
      <View
        className={cn(
          "border border-muted p-2 rounded-lg my-1",
          parseInt(item.stock) === 0 && "bg-gray-50"
        )}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold">
            {getCropEmoji(item.name)} {item.name}
          </Text>
          <Text>{item.MRP} ₹</Text>
        </View>
        {parseInt(item.stock) === 0 ? (
          <Text className="pt-1">Sold out</Text>
        ) : (
          <Text className="pt-1 text-muted-foreground">
            Stock: {item.stock} kg
          </Text>
        )}
      </View>
    );
  };

  const renderItemCustomer = ({ item }: { item: PurchaseHistory }) => {
    return (
      <View className="mx-2 p-4 rounded-2xl border border-muted my-1">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl font-semibold">
              {getCropEmoji(item.crop.name)}
            </Text>
            <Text className="text-lg font-semibold">{item.crop.name}</Text>
          </View>
          <Text className="text-xs text-gray-500">Qty: {item.amount}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <LucidIcons IconName={IndianRupee} size={16} />
          <Text className="text-gray-700 ">{item.amount * item.crop.MRP}</Text>
        </View>

        <View className="flex-row items-center gap-2 mt-2">
          <LucidIcons IconName={UserIcon} size={18} />
          <Text className="text-sm text-gray-600">
            {item.customer.name} ({item.customer.email})
          </Text>
        </View>
      </View>
    );
  };

  const TabPages = useMemo(() => {
    return [
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-3 flex-1"
        data={userData?.crops}
        renderItem={renderItem}
        keyExtractor={(item) => `${item._id}_${item.name}`}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchUserData} />
        }
        ListFooterComponent={
          <Button
            variant={"secondary"}
            className="my-3 flex-row gap-3"
            onPress={() => router.push("/(root)/(Production)/AddNewCrop")}
          >
            <LucidIcons IconName={Sprout} />
            <Text>Add new Crop</Text>
          </Button>
        }
        ListEmptyComponent={
          !isLoading ? (
            <>
              <Pressable
                className="h-1/2 rounded-xl flex items-center justify-center flex-row gap-3 bg-slate-50"
                onPress={() => router.push("/(root)/(Production)/AddNewCrop")}
              >
                <LucidIcons IconName={Sprout} />
                <Text>Add new crop</Text>
              </Pressable>
              <Text className="text-center my-9">
                {t("No crops registered yet")}
              </Text>
            </>
          ) : (
            <View />
          )
        }
      />,
      // <ScrollView showsVerticalScrollIndicator={false}>
      //   <View className="px-3 pt-3">
      //     <View className="flex-row justify-between mb-6">
      //       <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
      //         <LucidIcons IconName={Leaf} size={24} color="#2E7D32" />

      //         <Text className="text-2xl font-bold text-green-800 mt-2">
      //           1,234
      //         </Text>
      //         <Text className="text-sm text-gray-500 text-center">
      //           Active Crops
      //         </Text>
      //       </View>
      //       <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
      //         <LucidIcons IconName={Droplet} size={24} color="#2E7D32" />
      //         <Text className="text-2xl font-bold text-green-800 mt-2">
      //           87%
      //         </Text>
      //         <Text className="text-sm text-gray-500 text-center">
      //           Soil Health
      //         </Text>
      //       </View>
      //       <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
      //         <LucidIcons IconName={Sun} size={24} color="#2E7D32" />
      //         <Text className="text-2xl font-bold text-green-800 mt-2">
      //           28°C
      //         </Text>
      //         <Text className="text-sm text-gray-500 text-center">
      //           Temperature
      //         </Text>
      //       </View>
      //     </View>
      //   </View>
      //   <View style={{ paddingHorizontal: 16 }}>
      //     <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
      //       Active Fields
      //     </Text>

      //     {fields.map((field: Field, index: number) => (
      //       <FieldCard key={index} field={field} />
      //     ))}
      //   </View>
      // </ScrollView>,
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-3 flex-1"
        data={customerData}
        renderItem={renderItemCustomer}
        keyExtractor={(item, index) => `${item.crop._id}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={customerLoading}
            onRefresh={fetchCustomers}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-center my-9">{t("No customers yet")}</Text>
          ) : (
            <View />
          )
        }
      />,
    ];
  }, [customerData, i18n.language, customerLoading, isLoading]);

  return <TabComponent tabsData={tabsData} Pages={TabPages} />;
};

export default Production;
