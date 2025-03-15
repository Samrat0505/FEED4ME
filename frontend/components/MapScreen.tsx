import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import LucidIcons from "./LucidIcons";
import { ArrowLeft, RefreshCcw, RefreshCwIcon } from "lucide-react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComponent from "./BottomSheetComponent";
import { router } from "expo-router";

type markerDetails = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

const Markers: markerDetails[] = [
  {
    name: "Everest Storage Hub",
    description:
      "A high-capacity warehouse specializing in electronics and perishable goods.",
    latitude: 30.85,
    longitude: 78.2,
  },
  {
    name: "Himalayan Logistics Center",
    description:
      "A well-secured facility for industrial and commercial storage needs.",
    latitude: 30.6,
    longitude: 78.9,
  },
  {
    name: "Uttarakhand Freight Depot",
    description:
      "Provides storage solutions for agricultural and FMCG products.",
    latitude: 30.2,
    longitude: 78.5,
  },
  {
    name: "Ganga Valley Storage",
    description:
      "Ideal for bulk storage with temperature-controlled facilities.",
    latitude: 31.0,
    longitude: 77.9,
  },
  {
    name: "Pinecrest Warehouse",
    description: "A secure storage hub for retail and e-commerce businesses.",
    latitude: 30.3,
    longitude: 79.1,
  },
  {
    name: "Mountain View Storage",
    description:
      "Offers flexible storage solutions for small businesses and startups.",
    latitude: 29.9,
    longitude: 78.3,
  },
  {
    name: "Green Valley Logistics",
    description: "Eco-friendly warehouse with solar-powered operations.",
    latitude: 31.2,
    longitude: 78.0,
  },
  {
    name: "Himalayan Cold Storage",
    description:
      "Specialized in frozen and temperature-sensitive goods storage.",
    latitude: 30.5,
    longitude: 77.5,
  },
  {
    name: "Summit Industrial Depot",
    description: "Handles large-scale industrial equipment and raw materials.",
    latitude: 29.8,
    longitude: 79.5,
  },
  {
    name: "Dehradun Distribution Center",
    description:
      "Strategically located for efficient distribution across North India.",
    latitude: 30.7,
    longitude: 77.8,
  },
];

export default function MapScreen() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMarker, setSelectedMarker] = useState<markerDetails | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleMarkerPress = (marker: markerDetails) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLoading(true);
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") {
    //   ToastAndroid.show(
    //     "Permission to access location was denied",
    //     ToastAndroid.SHORT
    //   );
    //   return;
    // }

    // let location = await Location.getCurrentPositionAsync({});
    // setLocation(location.coords);
    setLocation({
      accuracy: 100,
      altitude: 1052.9595947265625,
      altitudeAccuracy: 46.101173400878906,
      heading: 0,
      latitude: 30.214645,
      longitude: 78.9421962,
      speed: 0,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <View
        className="flex justify-center item-center gap-3"
        style={{
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
        }}
      >
        <Text className="text-center">Fetching current location</Text>
        <ActivityIndicator animating />
      </View>
    );
  }

  if (!location) {
    return (
      <View
        className="flex justify-center item-center p-5"
        style={{
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
        }}
      >
        <Text className="text-center mb-5">
          Unable to fetch current location
        </Text>
        <Button
          onPress={getLocation}
          className="w-fit rounded-full flex gap-3 flex-row"
          variant={"outline"}
        >
          <LucidIcons IconName={RefreshCcw} />
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingEnabled={true}
        showsMyLocationButton={true}
        // onRegionChangeComplete={(data) => {
        //   console.log(data, "fetch storage in this location");
        // }}
      >
        <Marker
          coordinate={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
          title="Current location"
          pinColor="indigo"
        />
        {Markers.map((marker: markerDetails, index: number) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker?.latitude,
                longitude: marker?.longitude,
              }}
              title={marker.name}
              description="50 percent full"
              onPress={() => handleMarkerPress(marker)}
            />
          );
        })}
      </MapView>
      <View
        className="absolute flex items-center justify-between flex-row w-full p-5"
        style={{ top: StatusBar.currentHeight || 0 + 5 }}
      >
        <Button
          variant={"outline"}
          className="rounded-full flex gap-3 flex-row justify-center items-center"
          onPress={() => router.back()}
        >
          <LucidIcons IconName={ArrowLeft} />
        </Button>
        <Button
          variant={"outline"}
          className="rounded-full flex gap-3 flex-row justify-center items-center"
        >
          <LucidIcons IconName={RefreshCwIcon} />
          <Text>Refresh</Text>
        </Button>
      </View>
      <View className="absolute w-full bg-white bottom-0 dark:bg-black">
        <Text className="text-sm text-center px-2">
          Select a storage facility to show moew details
        </Text>
      </View>
      <BottomSheetComponent
        title={
          selectedMarker
            ? selectedMarker.name
            : "Select a marker to see details"
        }
        subTitle={selectedMarker ? selectedMarker.description : ""}
        BottomSheetFooterComponent={
          <Button
            variant={"secondary"}
            onPress={() =>
              router.push(
                `/(root)/(storage)/StorageDetails?storageId=${selectedMarker?.name}&storageName=${selectedMarker?.name}`
              )
            }
          >
            <Text>More details</Text>
          </Button>
        }
        ref={bottomSheetRef}
        children={
          <>{/* <Text className="text-center">50 percent left</Text> */}</>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
});
