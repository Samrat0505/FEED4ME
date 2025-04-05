import {
  View,
  StatusBar,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { registerUser, verifyOTP } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { useTranslation } from "react-i18next";
import { OtpInput } from "react-native-otp-entry";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";
import LucidIcons from "~/lib/LucidIcons";

type UserDetails = {
  name: string;
  email: string;
  MobileNo: string;
  password: string;
  password1: string;
  age: string;
  role: "customer" | "farmer" | "storage";
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
};

const SignUp = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState<UserDetails>({
    name: "",
    email: "",
    MobileNo: "",
    password: "",
    password1: "",
    age: "",
    role: "farmer",
    location: {
      address: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  });

  const { setUser } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOTPSent, setIsOtpSent] = useState<boolean>(false);
  const [isLocationloading, setisLocationloading] = useState<boolean>(false);

  async function signUpHandler() {
    // Vibrate(isHapticFeedBackEnabled);

    if (!value.email && value.MobileNo.length !== 10) {
      ToastAndroid.show(
        t("Enter at least Email or phone no"),
        ToastAndroid.SHORT
      );
      setError(t("Enter at least Email or phone no"));
      return;
    }

    if (
      value.password === "" ||
      value.password1 === "" ||
      value.age === "" ||
      value.name === ""
    ) {
      ToastAndroid.show(t("Fill all required fields"), ToastAndroid.SHORT);
      setError(t("Fill all required fields"));
      return;
    }

    if (
      value.location.coordinates.coordinates[0] === 0 ||
      value.location.coordinates.coordinates[1] === 0
    ) {
      ToastAndroid.show(t("Please fetch current location"), ToastAndroid.SHORT);
      setError(t("Please fetch current location"));
      return;
    }
    if (value.password1 !== value.password) {
      ToastAndroid.show(t("Passwords do not match!"), ToastAndroid.SHORT);
      setError(t("Passwords do not match!"));
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser(value.role, {
        age: value.age,
        email: value.email,
        location: value.location,
        mobile: value.MobileNo,
        name: value.name,
        password: value.password,
      });
      data && setIsOtpSent(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  const getLocation = async () => {
    setisLocationloading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      ToastAndroid.show(
        t("Permission to access location was denied"),
        ToastAndroid.SHORT
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const address = await getAddressFromCoordinatesOSM(
      location.coords.latitude,
      location.coords.longitude
    );

    setValue((prev) => ({
      ...prev,
      location: {
        address: address,
        coordinates: {
          type: "Point",
          coordinates: [location.coords.latitude, location.coords.longitude],
        },
      },
    }));
    setisLocationloading(false);
  };

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
        ToastAndroid.show(t("Address details not found"), ToastAndroid.SHORT);
        return " ";
      }
    } catch (error) {
      return " ";
    }
  };

  //-------------------------------------------------------
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    if (otp.length !== 5) {
      ToastAndroid.show(t("Please enter a 5-digit OTP"), ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    try {
      const data = await verifyOTP(
        "farmer",
        value.MobileNo.length === 10 ? value.MobileNo : value.email,
        otp
      );
      data && setUser(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isOTPSent ? (
          <View
            className="p-5 flex gap-3 dark:bg-black"
            style={{ paddingTop: StatusBar.currentHeight }}
          >
            <View className="mt-6">
              <Text className="text-2xl font-bold text-gray-800">
                {t("Enter OTP")}
              </Text>
              <Text>
                {t("Otp sent to your email address")} - {value.email}
              </Text>
            </View>

            <OtpInput
              numberOfDigits={5}
              onTextChange={(text) => setOtp(text)}
            />

            <Button
              className="mt-3"
              variant={"outline"}
              onPress={handleVerifyOTP}
            >
              <Text className="font-bold">
                {isLoading ? <ActivityIndicator animating /> : t("Verify OTP")}
              </Text>
            </Button>
          </View>
        ) : (
          <View
            className="p-5 flex gap-3 dark:bg-black"
            style={{ paddingTop: StatusBar.currentHeight }}
          >
            <Text className="text-4xl font-bold py-5 pb-0">{t("Sign up")}</Text>
            <Text className="font-semibold py-5 pt-0 text-muted-foreground">
              {t("create new account account")}
            </Text>
            {/* <View className="flex items-center justify-center"> */}
            {/* <Image
                source={require("assets/Images/LogIn.svg")}
                style={{ width: width - 60, height: width - 60 }}
                contentFit="contain"
              /> */}
            {/* </View> */}

            <Text className="text-sm font-semibold">
              {t("Enter your name")}
            </Text>
            <Input
              placeholder="John doe"
              onChangeText={(text) => setValue({ ...value, name: text })}
              textContentType="name"
            />

            <Text className="text-sm font-semibold">{t("Role")}</Text>
            <Select
              onValueChange={(text) => {
                const selectedRole = text?.value as
                  | "customer"
                  | "farmer"
                  | "storage";
                if (selectedRole) {
                  setValue((prev) => ({ ...prev, role: selectedRole }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm native:text-lg"
                  placeholder={t("Select a Role")}
                />
              </SelectTrigger>
              <SelectContent className="w-[90%] mt-2">
                <SelectGroup>
                  <SelectItem label={t("Farmer")} value="farmer">
                    {t("Farmer")}
                  </SelectItem>
                  <SelectItem label={t("Customer")} value="customer">
                    {t("Customer")}
                  </SelectItem>
                  <SelectItem label={t("Storage Manager")} value="storage">
                    {t("Storage Manager")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Text className="text-sm">
              *{t("If no role is selected, 'Farmer' will be set as default.")}
            </Text>

            <View className="bg-slate-100 p-3 flex gap-3 dark:bg-slate-800 rounded-lg">
              <Text className="text-sm font-semibold">
                {t("Enter your email")}
              </Text>

              <Input
                placeholder="example@xyz.com"
                onChangeText={(text: string) =>
                  setValue({ ...value, email: text })
                }
              />
              <Text className="text-center"> Or </Text>
              <Text className="text-sm font-semibold">
                {t("Enter your Phone no")}
              </Text>
              <Input
                placeholder="+91 9678908798"
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text: string) =>
                  setValue({ ...value, MobileNo: text })
                }
              />
            </View>

            <Text className="text-sm font-semibold">
              {t("Get your current location")}
            </Text>
            {value?.location?.address ? (
              <Button
                variant={"outline"}
                onPress={() => {
                  setValue((prev) => ({
                    ...prev,
                    location: {
                      address: "",
                      coordinates: {
                        type: "Point",
                        coordinates: [0, 0],
                      },
                    },
                  }));
                }}
              >
                <Text>{value?.location?.address}</Text>
              </Button>
            ) : (
              <Button
                disabled={isLocationloading}
                onPress={() => getLocation()}
                variant={"outline"}
              >
                {isLocationloading ? (
                  <View className="flex justify-center item-center gap-3 flex-row">
                    <ActivityIndicator animating />
                    <Text className="text-center">
                      {t("Fetching current location")}...
                    </Text>
                  </View>
                ) : (
                  <View className="flex justify-center item-center gap-3 flex-row">
                    <LucidIcons IconName={MapPin} />
                    <Text>{t("Get current Location")}</Text>
                  </View>
                )}
              </Button>
            )}

            <Text className="text-sm font-semibold">{t("Enter your age")}</Text>
            <Input
              placeholder="24"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={(text) => setValue({ ...value, age: text })}
            />
            <Text className="text-sm font-semibold">{t("Enter password")}</Text>
            <Input
              placeholder="******"
              onChangeText={(text) => setValue({ ...value, password: text })}
              secureTextEntry={true}
              textContentType="password"
            />
            <Text className="text-sm font-semibold">
              {t("Re-Enter password")}
            </Text>
            <Input
              placeholder="******"
              onChangeText={(text) => setValue({ ...value, password1: text })}
              secureTextEntry={true}
              textContentType="password"
            />

            <Button
              variant="secondary"
              className="rounded-full mt-5"
              onPress={signUpHandler}
            >
              <Text>
                {isLoading ? (
                  <ActivityIndicator animating />
                ) : (
                  `${t("Sign up")}`
                )}
              </Text>
            </Button>

            <View className="mb-5">
              {!!error && (
                <View className="w-full p-4 pt-0">
                  <Text className="text-red-500 text-center">{error}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default SignUp;
