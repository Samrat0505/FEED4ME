import { t } from "i18next";
import { Package, PackageCheck } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import CustomerView from "~/components/Purchase/CustomerView";
import TabComponent from "~/components/TabComponent";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlobalContext } from "~/Context/ContextProvider";
import i18n from "~/lib/i18next";
import { cn } from "~/lib/utils";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type RentEquipment = {
  id: string;
  name: string;
  price: string;
  available: boolean;
  image: string;
};

const Purchase = () => {
  const { user } = useGlobalContext();
  if (user.user.role === "customer") return <CustomerView />;

  const toolsData: Product[] = [
    {
      id: "1",
      name: "Tractor",
      price: "₹12,500",
      image:
        "https://th.bing.com/th/id/OIP.2tW6ABdcdFx5Ha84V3pGQQHaFT?rs=1&pid=ImgDetMain",
    },
    {
      id: "2",
      name: "Harvester",
      price: "₹8,900",
      image:
        "https://media.istockphoto.com/photos/modern-agricultural-combine-front-view-picture-id1179992576?k=20&m=1179992576&s=612x612&w=0&h=2pAVFFlQmPirfS40LCWyghdxSe700g62GnG9GjEynFc=",
    },
    {
      id: "3",
      name: "Sprayer",
      price: "₹2,200",
      image:
        "https://th.bing.com/th/id/OIP.iIHG9Rdc6w7MkUL-psDBUwHaFc?w=252&h=185&c=7&r=0&o=5&dpr=1.4&pid=1.7",
    },
    {
      id: "4",
      name: "Seed Drill",
      price: "₹5,600",
      image:
        "https://th.bing.com/th/id/OIP.Uf5r-gJWOy1FBD0sAvoKnAHaE0?w=258&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7",
    },
  ];

  const testingKitsData: Product[] = [
    {
      id: "1",
      name: "Soil pH Tester",
      price: "₹850",
      image:
        "https://th.bing.com/th/id/OIP.nudo83-clG7OQrnWoSeb3QAAAA?rs=1&pid=ImgDetMain",
    },
    {
      id: "2",
      name: "Moisture Meter",
      price: "₹1,200",
      image:
        "https://thumbs.dreamstime.com/b/moisture-meter-isolated-above-white-background-264446018.jpg",
    },
    {
      id: "3",
      name: "NPK Test Kit",
      price: "₹1,800",
      image:
        "https://th.bing.com/th/id/OIP.EzLDjBOAKvcQQ_4RNmtkuwHaHa?rs=1&pid=ImgDetMain",
    },
    {
      id: "4",
      name: "Water Quality Kit",
      price: "₹950",
      image:
        "https://th.bing.com/th/id/OIP.eWGfc9WKn1A5ifkHgrt6IQHaHa?rs=1&pid=ImgDetMain",
    },
  ];

  const foodData: Product[] = [
    {
      id: "1",
      name: "Organic Fertilizer",
      price: "₹450",
      image:
        "https://th.bing.com/th/id/OIP.GTWt7mzEx0O24jmXTCyG8wHaE7?rs=1&pid=ImgDetMain",
    },
    {
      id: "2",
      name: "Plant Booster",
      price: "₹320",
      image: "https://m.media-amazon.com/images/I/61nNOZgFJTL._SL1500_.jpg",
    },
    {
      id: "3",
      name: "Compost Mix",
      price: "₹280",
      image:
        "https://media.istockphoto.com/id/1329155362/photo/composting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=ACWq7kYt9nqoAHTUBV3wmb0agPYXfRKqgvBkhuRhEtU=",
    },
    {
      id: "4",
      name: "Seed Nutrients",
      price: "₹550",
      image:
        "https://th.bing.com/th/id/OIP.wjftDMVEqqElozACPuC23wHaGK?rs=1&pid=ImgDetMain",
    },
  ];

  const rentEquipmentData: RentEquipment[] = [
    {
      id: "1",
      name: "Tractor with Implements",
      price: "₹2,500/day",
      available: true,
      image:
        "https://th.bing.com/th/id/OIP.2tW6ABdcdFx5Ha84V3pGQQHaFT?rs=1&pid=ImgDetMain",
    },
    {
      id: "2",
      name: "Rotavator",
      price: "₹1,200/day",
      available: true,
      image:
        "https://thumbs.dreamstime.com/b/rotavator-isoalted-white-85383672.jpg",
    },
    {
      id: "3",
      name: "Combine Harvester",
      price: "₹4,000/day",
      available: false,
      image:
        "https://media.istockphoto.com/photos/modern-agricultural-combine-front-view-picture-id1179992576?k=20&m=1179992576&s=612x612&w=0&h=2pAVFFlQmPirfS40LCWyghdxSe700g62GnG9GjEynFc=",
    },
    {
      id: "4",
      name: "Drone for Crop Monitoring",
      price: "₹3,500/day",
      available: true,
      image:
        "https://th.bing.com/th/id/OIP.TDBm4csGyMriGbpkqNMYvgHaE7?rs=1&pid=ImgDetMain",
    },
    {
      id: "5",
      name: "Seed Drill Machine",
      price: "₹1,800/day",
      available: true,
      image:
        "https://th.bing.com/th/id/OIP.Uf5r-gJWOy1FBD0sAvoKnAHaE0?w=258&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7",
    },
  ];

  const ProductCard = ({ item }: { item: Product }) => (
    <View className="mr-4 bg-white rounded-xl w-48 overflow-hidden border border-muted">
      <View className="h-32 bg-gray-200">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="p-2">
        <Text className="font-medium text-sm">{item.name}</Text>
        <Text className="font-bold text-muted-foreground mb-2">
          {item.price}
        </Text>
        <Button variant={"secondary"} size={"sm"}>
          <Text>Buy Now</Text>
        </Button>
      </View>
    </View>
  );

  const CategorySection = ({
    title,
    data,
  }: {
    title: string;
    data: Product[];
  }) => (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-3 text-gray-800">
        {title}
        <Text className="text-sm"> - ({data?.length})</Text>
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );

  const RentEquipmentItem = ({ item }: { item: RentEquipment }) => (
    <View className="mb-2 bg-white border border-muted rounded-xl overflow-hidden">
      <View className="h-40 rounded-lg">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 px-3 py-1 justify-between mt-2">
        <View>
          <Text className="font-bold text-gray-800">{item.name}</Text>
          <Text className="text-muted-foreground">{item.price}</Text>
        </View>

        <Button
          variant={"secondary"}
          className={cn(" my-2", !item.available && "opacity-30")}
          disabled={!item.available}
        >
          <Text className="text-center text-xs font-medium">
            Rent ( {item.available ? "Available" : "Unavailable"})
          </Text>
        </Button>
      </View>
    </View>
  );

  const tabsData = useMemo(() => {
    return [{ name: t("Buy") }, { name: t("Rent") }];
  }, [i18n.language]);

  const TabPages = useMemo(() => {
    return [
      <ScrollView showsVerticalScrollIndicator={false} key="buy-tab">
        <View className="p-3">
          <CategorySection title="Tools" data={toolsData} />
          <CategorySection title="Testing Kits" data={testingKitsData} />
          <CategorySection title="Food" data={foodData} />
        </View>
      </ScrollView>,
      <ScrollView showsVerticalScrollIndicator={false} key="rent-tab">
        <View className="p-3">
          {rentEquipmentData.map((item) => (
            <RentEquipmentItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>,
    ];
  }, []);

  return <TabComponent tabsData={tabsData} Pages={TabPages} />;
};

export default Purchase;
