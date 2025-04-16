"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  ImagePlus,
  MapPin,
  PersonStandingIcon,
  Rabbit,
  Upload,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getNgoList, NGO, submitFoodWastageReport } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import * as ImagePicker from "expo-image-picker";
import ImagePickerComponent from "~/components/ImagePickerComponent";
import { cn } from "~/lib/utils";
import LucidIcons from "~/lib/LucidIcons";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import BottomSheetComponent from "~/components/BottomSheetComponent";
import BottomSheet from "@gorhom/bottom-sheet";
import { Button } from "~/components/ui/button";
import { WasteFood } from "~/lib/constants";

export default function App() {
  const { user } = useGlobalContext();
  const [wasteType, setWasteType] = useState<"human" | "cattle">("human");
  const [foodType, setFoodType] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [collectionPoint, setCollectionPoint] = useState<{
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  }>({
    address: "",
    coordinates: {
      type: "Point",
      coordinates: [0, 0],
    },
  });
  const [SelectedNgoId, setSelectedNgoId] = useState<string>("");

  const [selectedImage, setselectedImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);

  const [preparedDate, setPreparedDate] = useState<Date>(new Date());
  const [availableFromDate, setAvailableFromDate] = useState<Date>(new Date());
  const [availableToDate, setAvailableToDate] = useState<Date>(new Date());
  const [errorText, setErrorText] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const CollectionPointRef = useRef<BottomSheet>(null);
  const [showPreparedDatePicker, setShowPreparedDatePicker] = useState(false);
  const [showPreparedTimePicker, setShowPreparedTimePicker] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const [NgoData, setNgoData] = useState<NGO[] | []>([]);
  const [NgoLoading, setNgoLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const data = await getNgoList(
        user?.user.location.coordinates.coordinates[0],
        user?.user.location.coordinates.coordinates[1]
      );
      setNgoData(data);
      setNgoLoading(false);
    })();
  }, []);

  const collectionPoints: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  }[] = [
    {
      address: "123 Maple Street, Springfield, IL",
      coordinates: {
        type: "Point",
        coordinates: [-89.65, 39.7833],
      },
    },
    {
      address: "456 Ocean Drive, Miami Beach, FL",
      coordinates: {
        type: "Point",
        coordinates: [-80.13, 25.7907],
      },
    },
    {
      address: "789 Sunset Blvd, Los Angeles, CA",
      coordinates: {
        type: "Point",
        coordinates: [-118.37, 34.0983],
      },
    },
    {
      address: "321 Broadway, New York, NY",
      coordinates: {
        type: "Point",
        coordinates: [-74.0059, 40.7128],
      },
    },
    {
      address: "555 Lakeside Ave, Cleveland, OH",
      coordinates: {
        type: "Point",
        coordinates: [-81.6954, 41.5055],
      },
    },
    {
      address: "777 Queen Street, Honolulu, HI",
      coordinates: {
        type: "Point",
        coordinates: [-157.8583, 21.3069],
      },
    },
    {
      address: "999 Main St, Austin, TX",
      coordinates: {
        type: "Point",
        coordinates: [-97.7431, 30.2672],
      },
    },
    {
      address: "222 Bourbon St, New Orleans, LA",
      coordinates: {
        type: "Point",
        coordinates: [-90.067, 29.9584],
      },
    },
    {
      address: "888 Beacon Street, Boston, MA",
      coordinates: {
        type: "Point",
        coordinates: [-71.0942, 42.3505],
      },
    },
    {
      address: "444 Fremont Street, Las Vegas, NV",
      coordinates: {
        type: "Point",
        coordinates: [-115.1402, 36.1716],
      },
    },
  ];

  const handleSubmit = async () => {
    const showToast = (message: string) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      setErrorText(message);
    };

    if (!foodType) return showToast("Please select a food type.");
    if (!wasteType) return showToast("Please select a waste type.");
    if (!quantity) return showToast("Please enter quantity.");
    if (collectionPoint.address === "")
      return showToast("Please provide a collection point.");
    if (!preparedDate) return showToast("Please select a prepared date.");
    if (!availableFromDate || !availableToDate)
      return showToast("Please provide availability time range.");
    if (!SelectedNgoId) return showToast("Please select an NGO.");
    var asset = null;
    if (selectedImage?.assets?.[0]) {
      asset = selectedImage.assets[0];
    }

    await submitFoodWastageReport(user?.token, {
      donor: user.user._id,
      donorModel: user.user.role === "farmer" ? "Farmers" : "Storage",
      foodType,
      collectionPoint: JSON.stringify(collectionPoint),
      image: asset
        ? {
            uri: asset.uri,
            name: asset.fileName ?? "image.jpg",
            type: asset.mimeType ?? "image/jpeg",
          }
        : null,
      ngo: SelectedNgoId,
      quantity,
      wasteType,
      availableOn: `from ${format(availableFromDate, "PPP")} at ${format(
        availableFromDate,
        "h:mm aaa"
      )} to ${format(availableToDate, "PPP")} at ${format(
        availableToDate,
        "h:mm aaa"
      )}`,
      preparedOn: `on ${format(preparedDate, "PPP")} at ${format(
        preparedDate,
        "h:mm aaa"
      )}`,
    });

    setShowConfirmation(true);
    setErrorText("");
  };

  const onDateChange = (
    event: any,
    selectedDate: Date | undefined,
    setDateFunction: React.Dispatch<React.SetStateAction<Date>>
  ) => {
    const currentDate = selectedDate || new Date();
    setDateFunction(currentDate);
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4 pt-0">
            <Text className="text-gray-600 mb-3">
              Help reduce food waste by reporting excess food for humans or
              cattle
            </Text>

            <View className="mb-5">
              <Text className="text-lg font-medium text-green-700 mb-2">
                Waste Type Selection
              </Text>
              <View>
                <TouchableOpacity
                  className={`flex-row items-center border rounded-md p-3 mb-2 ${
                    wasteType === "human"
                      ? "bg-orange-50 border-orange-300"
                      : "border-muted"
                  }`}
                  onPress={() => setWasteType("human")}
                >
                  <Text className="flex-1 text-gray-700">
                    Eatable for Humans
                  </Text>
                  <LucidIcons IconName={PersonStandingIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-row items-center border rounded-md p-3 ${
                    wasteType === "cattle"
                      ? "bg-green-50 border-green-300"
                      : "border-muted"
                  }`}
                  onPress={() => setWasteType("cattle")}
                >
                  <Text className="flex-1 text-gray-700">
                    Eatable for Cattle
                  </Text>
                  <LucidIcons IconName={Rabbit} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-lg font-medium text-green-700 mb-2">
                Food Description
              </Text>

              <View className="mb-4 border border-muted p-2 rounded-lg">
                <Text className="text-gray-700 mb-1">Type of Food</Text>
                <View className="flex items-center justify-start flex-wrap flex-row">
                  {WasteFood.map((item, index) => {
                    return (
                      <Pressable
                        key={index}
                        className={cn(
                          "m-1 border border-muted rounded-full py-1 px-2",
                          foodType === item.name && "bg-slate-200"
                        )}
                        onPress={() => setFoodType(item.name)}
                      >
                        <Text>
                          {item.icon} {item.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Pressable className="m-1 border border-muted rounded-full py-1 px-2">
                    <Text>Other please mention...</Text>
                  </Pressable>
                </View>
                <Input
                  className="border border-gray-300 rounded-md p-3 bg-white my-2"
                  placeholder="e.g., Leftover Rice and Dal"
                  value={foodType}
                  onChangeText={setFoodType}
                />
              </View>

              <Text className="mb-2">Select a Ngo to Donate food</Text>
              {NgoLoading ? (
                <Button
                  variant={"outline"}
                  className="flex items-center justify-center gap-3 flex-row mb-2"
                >
                  <ActivityIndicator animating />
                  <Text>Loading Ngos...</Text>
                </Button>
              ) : (
                <Select
                  onValueChange={(text) => {
                    if (text) {
                      const selectedNgo: string = text?.value;
                      setSelectedNgoId(selectedNgo);
                    }
                  }}
                  className="mb-2"
                >
                  <SelectTrigger>
                    <SelectValue
                      className="text-foreground text-sm native:text-lg"
                      placeholder="Select a Ngo"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-[90%] mt-2">
                    <SelectGroup>
                      {NgoData?.map(
                        (
                          item: {
                            _id: string;
                            name: string;
                          },
                          index: number
                        ) => {
                          return (
                            <SelectItem
                              key={index}
                              label={item.name}
                              value={item._id}
                            >
                              <Text className="font-bold text-xl">
                                {item.name}
                              </Text>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              <View className="mb-4">
                <Text className="text-gray-700 mb-1">Quantity (in Kg)</Text>
                <Input
                  className="border border-gray-300 rounded-md p-3 bg-white"
                  placeholder="e.g., 5 kg"
                  keyboardType="number-pad"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1">Prepared On</Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center"
                  onPress={() => setShowPreparedDatePicker(true)}
                >
                  <Calendar width={16} height={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700">
                    {format(preparedDate, "PPP")}
                  </Text>
                </TouchableOpacity>

                {showPreparedDatePicker && (
                  <DateTimePicker
                    value={preparedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowPreparedDatePicker(false);
                      onDateChange(event, selectedDate, setPreparedDate);
                    }}
                  />
                )}

                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center mt-2"
                  onPress={() => setShowPreparedTimePicker(true)}
                >
                  <Clock width={16} height={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700">
                    {format(preparedDate, "h:mm aaa")}
                  </Text>
                </TouchableOpacity>

                {showPreparedTimePicker && (
                  <DateTimePicker
                    value={preparedDate}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowPreparedTimePicker(false);
                      onDateChange(event, selectedDate, setPreparedDate);
                    }}
                  />
                )}
              </View>
            </View>

            <View className="mb-5">
              <View className="flex-row items-center mb-2">
                <ImagePlus width={20} height={20} color="#15803d" />
                <Text className="text-lg font-medium text-green-700 ml-2">
                  Image Upload (Optional)
                </Text>
              </View>

              <ImagePickerComponent
                image={selectedImage}
                setImage={setselectedImage}
              />
            </View>

            <View className="mb-5">
              <View className="flex-row items-center mb-2">
                <Clock width={20} height={20} color="#15803d" />
                <Text className="text-lg font-medium text-green-700 ml-2">
                  Availability Window
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1">From</Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center"
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Calendar width={16} height={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700">
                    {format(availableFromDate, "PPP")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center mt-2"
                  onPress={() => setShowFromTimePicker(true)}
                >
                  <Clock width={16} height={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700">
                    {format(availableFromDate, "h:mm aaa")}
                  </Text>
                </TouchableOpacity>

                {showFromDatePicker && (
                  <DateTimePicker
                    value={availableFromDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowFromDatePicker(false);
                      onDateChange(event, selectedDate, setAvailableFromDate);
                    }}
                  />
                )}

                {showFromTimePicker && (
                  <DateTimePicker
                    value={availableFromDate}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowFromTimePicker(false);
                      onDateChange(event, selectedDate, setAvailableFromDate);
                    }}
                  />
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1">To</Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center"
                  onPress={() => setShowToDatePicker(true)}
                >
                  <Calendar width={16} height={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700">
                    {format(availableToDate, "PPP")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-3 bg-white flex-row items-center mt-2"
                  onPress={() => setShowToTimePicker(true)}
                >
                  <Clock width={16} height={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700">
                    {format(availableToDate, "h:mm aaa")}
                  </Text>
                </TouchableOpacity>

                {showToDatePicker && (
                  <DateTimePicker
                    value={availableToDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowToDatePicker(false);
                      onDateChange(event, selectedDate, setAvailableToDate);
                    }}
                  />
                )}

                {showToTimePicker && (
                  <DateTimePicker
                    value={availableToDate}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowToTimePicker(false);
                      onDateChange(event, selectedDate, setAvailableToDate);
                    }}
                  />
                )}
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-lg font-medium text-green-700 mb-2">
                Nearby Collection Point
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-md p-3 bg-white"
                onPress={() => {
                  CollectionPointRef.current?.expand();
                }}
              >
                <Text className="text-gray-700">
                  {collectionPoint.address !== ""
                    ? collectionPoint.address
                    : "Select a collection point"}
                </Text>
              </TouchableOpacity>
            </View>
            {errorText && (
              <Text className="text-red-500 text-center mb-5">{errorText}</Text>
            )}

            <TouchableOpacity
              className="bg-green-600 py-3 rounded-md mb-8"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-bold text-lg">
                Report Food Waste
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          visible={showConfirmation}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-xl p-6 m-4 w-5/6 max-w-sm">
              <Text className="text-xl font-bold text-green-700 text-center mb-2">
                Thank You!
              </Text>
              <Text className="text-gray-700 text-center mb-6">
                Thank you for reporting food waste! A local volunteer or cattle
                shelter will be notified shortly.
              </Text>
              <TouchableOpacity
                className="bg-orange-600 py-3 rounded-md"
                onPress={() => router.back()}
              >
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <BottomSheetComponent
        title="Select Collection Point"
        subTitle="select a pickup point"
        backdropOpacity={0.8}
        ref={CollectionPointRef}
        BottomSheetFooterComponent={
          <TouchableOpacity
            className="mt-4 py-3 bg-gray-200 rounded-md"
            onPress={() => CollectionPointRef.current?.close()}
          >
            <Text className="text-center font-medium">Cancel</Text>
          </TouchableOpacity>
        }
        children={
          <View className=" rounded-t-xl p-4">
            {collectionPoints.map((point, index) => (
              <TouchableOpacity
                key={index}
                className="py-3 border-b border-muted"
                onPress={() => {
                  setCollectionPoint(point);
                  CollectionPointRef.current?.close();
                }}
              >
                <Text className="text-gray-800">{point.address}</Text>
              </TouchableOpacity>
            ))}
            <View className="p-10" />
          </View>
        }
      />
    </>
  );
}
