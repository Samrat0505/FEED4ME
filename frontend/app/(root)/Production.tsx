import { View, Text, ScrollView, Pressable } from "react-native";
import {
  AlertTriangle,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Droplet,
  Droplets,
  Leaf,
  MoreVertical,
  Sprout,
  Sun,
  Timer,
  TrendingUp,
  Wind,
} from "lucide-react-native";
import LucidIcons from "~/lib/LucidIcons";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
interface Field {
  id: string;
  status: string;
  crop: string;
  area: string;
  lastAction: string;
  plantedDate: string;
  harvestDate: string;
  cropHealth: number;
  waterUsage: string;
  yieldForecast: string;
  soilMoisture: string;
  pestRisk: string;
  windExposure: string;
  alerts: string[];
  daysToHarvest: number | null;
}
const fields: Field[] = [
  {
    id: "857",
    status: "Growing",
    crop: "Wheat",
    area: "12.5 ha",
    lastAction: "Fertilized 2 days ago",
    plantedDate: "Feb 15, 2025",
    harvestDate: "Jun 20, 2025",
    cropHealth: 92,
    waterUsage: "125 L/day",
    yieldForecast: "4.2 tons/ha",
    soilMoisture: "68%",
    pestRisk: "Low",
    windExposure: "Medium",
    alerts: [],
    daysToHarvest: 89,
  },
  {
    id: "858",
    status: "Cutting",
    crop: "Corn",
    area: "8.3 ha",
    lastAction: "Harvesting in progress",
    plantedDate: "Mar 10, 2025",
    harvestDate: "Today",
    cropHealth: 85,
    waterUsage: "180 L/day",
    yieldForecast: "5.8 tons/ha",
    soilMoisture: "72%",
    pestRisk: "Medium",
    windExposure: "Low",
    alerts: ["Harvesting equipment maintenance needed"],
    daysToHarvest: 0,
  },
];

const Production = () => {
  function FieldCard({ field }: { field: Field }) {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "Growing":
          return { backgroundColor: "green" };
        case "Cutting":
          return { backgroundColor: "orange" };
        case "Empty":
          return { backgroundColor: "gray" };
        default:
          return { backgroundColor: "blue" };
      }
    };

    return (
      <View
        style={{
          overflow: "hidden",
          backgroundColor: "white",
          borderRadius: 8,
          marginBottom: 12,
        }}
        className="border border-muted"
      >
        <View style={{ position: "relative" }}>
          <View
            style={{
              height: 6,
              ...getStatusColor(field.status),
            }}
          />

          <View style={{ padding: 16 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
                >
                  Field #{field.id}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Sprout color="green" size={16} />
                  <Text style={{ marginLeft: 4 }}>{field.crop}</Text>

                  <Text style={{ marginHorizontal: 6 }}>•</Text>

                  <Leaf color="green" size={16} />
                  <Text style={{ marginLeft: 4 }}>{field.area}</Text>

                  {field.daysToHarvest !== null && (
                    <>
                      <Text style={{ marginHorizontal: 6 }}>•</Text>
                      <Timer color="orange" size={16} />
                      <Text style={{ marginLeft: 4 }}>
                        {field.daysToHarvest === 0
                          ? "Harvest day"
                          : `${field.daysToHarvest} days to harvest`}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <Button variant="ghost" size="icon">
                <MoreVertical size={20} />
              </Button>
            </View>

            {field.alerts.length > 0 && (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: "#FEF3C7",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#FBBF24",
                }}
              >
                {field.alerts.map((alert: string, i: number) => (
                  <Text key={i} style={{ color: "#92400E", fontSize: 14 }}>
                    {alert}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View style={{ padding: 16, backgroundColor: "#F3F4F6" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Calendar color="gray" size={16} />
                  <Text style={{ marginLeft: 6, color: "#555" }}>
                    Planted: {field.plantedDate}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <Timer color="gray" size={16} />
                  <Text style={{ marginLeft: 6, color: "#555" }}>
                    Harvest: {field.harvestDate}
                  </Text>
                </View>
              </View>

              {field.status !== "Empty" && (
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Droplets color="gray" size={16} />
                    <Text style={{ marginLeft: 6, color: "#555" }}>
                      Water: {field.waterUsage}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <TrendingUp color="gray" size={16} />
                    <Text style={{ marginLeft: 6, color: "#555" }}>
                      Yield: {field.yieldForecast}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-3">
        <View className="flex-row justify-between mb-6">
          <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
            <LucidIcons IconName={Leaf} size={24} color="#2E7D32" />

            <Text className="text-2xl font-bold text-green-800 mt-2">
              1,234
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Active Crops
            </Text>
          </View>
          <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
            <LucidIcons IconName={Droplet} size={24} color="#2E7D32" />
            <Text className="text-2xl font-bold text-green-800 mt-2">87%</Text>
            <Text className="text-sm text-gray-500 text-center">
              Soil Health
            </Text>
          </View>
          <View className="p-5 rounded-xl items-center w-[32%] border border-muted">
            <LucidIcons IconName={Sun} size={24} color="#2E7D32" />
            <Text className="text-2xl font-bold text-green-800 mt-2">28°C</Text>
            <Text className="text-sm text-gray-500 text-center">
              Temperature
            </Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
          Active Fields
        </Text>

        {fields.map((field: Field, index: number) => (
          <FieldCard key={index} field={field} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Production;
