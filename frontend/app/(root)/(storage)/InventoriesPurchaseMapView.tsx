import MapView, { Marker } from "react-native-maps";
import { ArrowLeft, RefreshCwIcon } from "lucide-react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { getInventoriesNearby, Inventory } from "~/lib/Api";
import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import BottomSheetComponent from "~/components/BottomSheetComponent";
import LucidIcons from "~/lib/LucidIcons";
import { t } from "i18next";
import { useGlobalContext } from "~/Context/ContextProvider";

const InventoriesPurchaseMapView = () => {
  const { user } = useGlobalContext();

  const Latitude = user?.user.location.coordinates.coordinates[0] || 28.6139;
  const Longitude = user?.user.location.coordinates.coordinates[1] || 77.209;

  const [selectedMarker, setSelectedMarker] = useState<Inventory | null>(null);
  const [loadingMarkers, setloadingMarkers] = useState<boolean>(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [InventoriesNearby, setInventoriesNearby] = useState<Inventory[]>([]);
  const [CurrentRegion, setCurrentRegion] = useState<{
    lan: number;
    Long: number;
  }>({ lan: Latitude, Long: Longitude });

  const handleMarkerPress = (marker: Inventory) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand();
  };

  const fetchMarkers = async (lat: number | null, long: number | null) => {
    setloadingMarkers(true);
    const data = await getInventoriesNearby(user.token, lat, long);
    const UniqueArray: Inventory[] = [
      ...(data ?? []),
      ...InventoriesNearby,
    ].filter(
      (item, index, self) =>
        index === self.findIndex((obj) => obj._id === item._id)
    );
    setInventoriesNearby(UniqueArray);
    setloadingMarkers(false);
  };

  useEffect(() => {
    fetchMarkers(Latitude, Longitude);
  }, [Latitude, Longitude]);

  useEffect(() => {
    if (CurrentRegion.lan === Latitude || CurrentRegion.Long == Longitude) {
      return;
    }
    const timer = setTimeout(() => {
      fetchMarkers(CurrentRegion.lan, CurrentRegion.Long);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [CurrentRegion]);

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Latitude,
          longitude: Longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingEnabled={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={(data) => {
          setCurrentRegion({ lan: data.latitude, Long: data.longitude });
        }}
      >
        <Marker
          coordinate={{
            latitude: Latitude,
            longitude: Longitude,
          }}
          title={t("Current location")}
          pinColor="indigo"
          isPreselected={true}
        />
        {InventoriesNearby.map((marker: Inventory, index: number) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker?.location.coordinates.coordinates[0],
                longitude: marker?.location.coordinates.coordinates[1],
              }}
              title={marker.name}
              description={
                marker.totalQuantity -
                marker.reservedQuantity +
                t(" sq feet remaining")
              }
              onPress={() => {
                handleMarkerPress(marker);
              }}
            />
          );
        })}
      </MapView>
      <View
        className="absolute flex items-center justify-between flex-row p-5"
        style={{
          top: StatusBar.currentHeight || 0 + 5,
          width: Dimensions.get("screen").width,
        }}
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
          onPress={async () => {
            if (!loadingMarkers) {
              await fetchMarkers(
                CurrentRegion?.lan ?? Latitude,
                CurrentRegion?.Long ?? Longitude
              );
            }
          }}
        >
          {loadingMarkers ? (
            <>
              <ActivityIndicator animating />
              <Text>{t("Loading...")}</Text>
            </>
          ) : (
            <>
              <LucidIcons IconName={RefreshCwIcon} />
              <Text>{t("Refresh")}</Text>
            </>
          )}
        </Button>
      </View>
      <View
        className="absolute bg-white bottom-0 dark:bg-black"
        style={{ width: Dimensions.get("screen").width }}
      >
        <Text className="text-sm text-center px-2 text-indigo-600">
          {InventoriesNearby?.length} {t("Inventories showed")}
        </Text>
        <Text className="text-sm text-center px-2">
          {t("Select a storage facility to show more details")}
        </Text>
      </View>
      <BottomSheetComponent
        title={
          selectedMarker
            ? selectedMarker.name
            : "Select a marker to see details"
        }
        subTitle={
          selectedMarker
            ? selectedMarker.description
              ? selectedMarker.description
              : selectedMarker.location.address
            : ""
        }
        BottomSheetFooterComponent={
          <Button
            variant={"secondary"}
            onPress={() =>
              router.push(
                `/(root)/(storage)/StorageDetails?storageId=${selectedMarker?._id}&storageName=${selectedMarker?.name}`
              )
            }
          >
            <Text>{t("More details")}</Text>
          </Button>
        }
        ref={bottomSheetRef}
        children={
          <>
            <Text className="text-center pb-2">
              ₹{selectedMarker?.pricePerUnit} per sq feet
            </Text>
          </>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
});

export default InventoriesPurchaseMapView;
