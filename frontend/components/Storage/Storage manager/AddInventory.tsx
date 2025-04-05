import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AddInventoryRequest, addNewInventory } from "~/lib/Api";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlobalContext } from "~/Context/ContextProvider";
import LucidIcons from "~/lib/LucidIcons";
import { LocateFixed } from "lucide-react-native";

const AddInventory = ({
  token,
  setaddNewInventoryModel,
  fetchMyInventories,
}: {
  token: string;
  setaddNewInventoryModel: (value: boolean) => void;
  fetchMyInventories: Function;
}) => {
  const { user } = useGlobalContext();

  const initialLatitude =
    user?.user.location.coordinates.coordinates[0] || 28.6139;
  const initialLongitude =
    user?.user.location.coordinates.coordinates[1] || 77.209;

  const [newMarkerCoordinates, setnewMarkerCoordinates] = useState<{
    lat: number;
    long: number;
  } | null>({ lat: initialLatitude, long: initialLongitude });
  const [isSubmittionLoading, setisSubmittionLoading] =
    useState<boolean>(false);

  const [inventory, setInventory] = useState<AddInventoryRequest>({
    name: "",
    totalQuantity: 0,
    price: 0,
    crop: "",
    location: {
      address: "",
      coordinates: {
        type: "Point",
        coordinates: [initialLatitude, initialLongitude],
      },
    },
  });

  const getAddressFromCoordinatesOSM = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (data.display_name) {
        return data.display_name;
      } else {
        ToastAndroid.show("Address details not found", ToastAndroid.SHORT);
        return " ";
      }
    } catch (error) {
      console.error("OSM Geocoding error:", error);
      return " ";
    }
  };

  const handleAddInventory = async () => {
    if (
      !inventory.name ||
      inventory.totalQuantity <= 0 ||
      inventory.price <= 0
    ) {
      ToastAndroid.show(
        "Please fill all fields correctly.",
        ToastAndroid.SHORT
      );
      return;
    }
    setisSubmittionLoading(true);
    const address = await getAddressFromCoordinatesOSM(
      inventory.location?.coordinates?.coordinates[0],
      inventory.location?.coordinates?.coordinates[1]
    );
    const data: AddInventoryRequest = {
      ...inventory,
      location: {
        address: address,
        coordinates: inventory?.location?.coordinates,
      },
    };

    try {
      await addNewInventory(data, token);
      ToastAndroid.show("Added sucessfully", ToastAndroid.SHORT);
      fetchMyInventories();
      setaddNewInventoryModel(false);
    } catch (error) {
    } finally {
      setisSubmittionLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-5 flex gap-3">
        <Text style={styles.title}>Add New Inventory</Text>

        <Text className="text-sm font-semibold">Enter Inventory Name</Text>
        <Input
          placeholder="Inventory Name"
          value={inventory.name}
          onChangeText={(text) =>
            setInventory((prev) => ({ ...prev, name: text }))
          }
        />

        <Text className="text-sm font-semibold">Total Quantity (sq feet)</Text>
        <Input
          placeholder="500 sq feet"
          keyboardType="numeric"
          onChangeText={(text) => {
            const quantity = parseInt(text);
            setInventory((prev) => ({
              ...prev,
              totalQuantity: isNaN(quantity) ? 0 : quantity,
            }));
          }}
        />

        <Text className="text-sm font-semibold">Crop type</Text>
        <Input
          placeholder="eg. all, wheat etc"
          onChangeText={(text) => {
            setInventory((prev) => ({
              ...prev,
              crop: text,
            }));
          }}
        />

        <Text className="text-sm font-semibold">Price (INR per sq feet)</Text>
        <Input
          placeholder="600 INR"
          keyboardType="numeric"
          onChangeText={(text) => {
            const price = parseFloat(text);
            setInventory((prev) => ({
              ...prev,
              price: isNaN(price) ? 0 : price,
            }));
          }}
        />

        <Text className="text-sm font-semibold">Choose Storage Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: initialLatitude,
            longitude: initialLongitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          loadingEnabled={true}
          onRegionChangeComplete={(e) => {
            setnewMarkerCoordinates({ lat: e.latitude, long: e.longitude });
          }}
          onPress={(e) => {
            e.persist();
            setInventory((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                coordinates: {
                  type: "Point",
                  coordinates: [
                    e.nativeEvent.coordinate?.latitude,
                    e.nativeEvent.coordinate?.longitude,
                  ],
                },
              },
            }));
          }}
        >
          <Marker
            coordinate={{
              latitude: inventory?.location.coordinates.coordinates[0],
              longitude: inventory?.location.coordinates.coordinates[1],
            }}
            title="Storage Location"
            draggable
            onDragEnd={(e) => {
              e.persist();
              setInventory((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  coordinates: {
                    type: "Point",
                    coordinates: [
                      e.nativeEvent?.coordinate?.latitude,
                      e.nativeEvent?.coordinate?.longitude,
                    ],
                  },
                },
              }));
            }}
          />
        </MapView>
        <Button
          className="mb-4 flex items-center justify-center gap-3 flex-row"
          variant={"outline"}
          onPress={() => {
            newMarkerCoordinates &&
              setInventory((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  coordinates: {
                    type: "Point",
                    coordinates: [
                      newMarkerCoordinates?.lat,
                      newMarkerCoordinates?.long,
                    ],
                  },
                },
              }));
          }}
        >
          <LucidIcons IconName={LocateFixed} />
          <Text>Locate storage</Text>
        </Button>

        <Button
          variant={"outline"}
          onPress={handleAddInventory}
          disabled={isSubmittionLoading}
        >
          {isSubmittionLoading ? (
            <View className="flex flex-row gap-3 items-center justify-center">
              <ActivityIndicator animating />
              <Text>Adding...</Text>
            </View>
          ) : (
            <Text>Add Inventory</Text>
          )}
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddInventory;

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  map: { width: "100%", height: 300, borderRadius: 10 },
});
