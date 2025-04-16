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
import { role } from "~/lib/Types";

type UserDetails = {
  name: string;
  email: string;
  ngo_RegNo: string;
  contact_person: string;
  contact_person_mobile: string;
  focus_area: string;
  ngo_website: string;
  MobileNo: string;
  password: string;
  ngo_establishment: string;
  password1: string;
  age: string;
  role: role;
  location: {
    address: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  };
};

const SignUp = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState<UserDetails>({
    name: "",
    contact_person: "",
    focus_area: "",
    ngo_website: "",
    email: "",
    ngo_establishment: "",
    contact_person_mobile: "",
    MobileNo: "",
    password: "",
    password1: "",
    ngo_RegNo: "",
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
  const [otp, setOtp] = useState("");

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

    if (value.password === "" || value.password1 === "" || value.name === "") {
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
        contact_person: value.contact_person,
        focus_area: value.focus_area,
        ngo_website: value.ngo_website,
        establishment: value.ngo_establishment,
        contact_person_mobile: value.contact_person_mobile,
        ngo_RegNo: value.ngo_RegNo,
      });

      if (data) {
        setIsOtpSent(true);
      } else {
        ToastAndroid.show(
          t("Something went wrong. Please try again."),
          ToastAndroid.SHORT
        );
        setError(t("Something went wrong. Please try again."));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        t("Registration failed. Please try again.");
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      setError(errorMessage);
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

  const handleVerifyOTP = async () => {
    if (otp.length !== 5) {
      ToastAndroid.show(t("Please enter a 5-digit OTP"), ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    try {
      const data = await verifyOTP(
        value.role,
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

            <Text className="text-sm font-semibold">{t("Role")}</Text>
            <Select
              onValueChange={(text) => {
                const selectedRole = text?.value as role;
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
                  {["farmer", "customer", "storage", "ngo"].map((val) => (
                    <SelectItem key={val} label={t(val)} value={val}>
                      <Text>{t(val)}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Text className="text-sm">
              *{t("If no role is selected, 'Farmer' will be set as default.")}
            </Text>

            {value.role === "ngo" ? (
              <>
                <Text className="text-sm font-semibold">
                  {t("Name of Ngo")}
                </Text>
                <Input
                  placeholder="eg: sub ka saath"
                  onChangeText={(text) => setValue({ ...value, name: text })}
                />
                <Text className="text-sm font-semibold">
                  {t("Name of person in contact")}
                </Text>
                <Input
                  placeholder="John doe"
                  onChangeText={(text) =>
                    setValue({ ...value, contact_person: text })
                  }
                  textContentType="name"
                />
                <Text className="text-sm font-semibold">
                  {t("Contect number of person")}
                </Text>
                <Input
                  placeholder="+91 9678908798"
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={(text) =>
                    setValue({ ...value, contact_person_mobile: text })
                  }
                />
                <Text className="text-sm font-semibold">
                  {t("Establishment year of Ngo")}
                </Text>
                <Input
                  placeholder="eg: 1992"
                  keyboardType="number-pad"
                  maxLength={4}
                  onChangeText={(text) =>
                    setValue({ ...value, ngo_establishment: text })
                  }
                />
                <Text className="text-sm font-semibold">
                  {t("Ngo Focus area")}
                </Text>
                <Input
                  placeholder="eg. food, poverty, women empowerment etc"
                  onChangeText={(text) =>
                    setValue({ ...value, focus_area: text })
                  }
                />
                <Text className="text-sm font-semibold">
                  {t("website (Optional)")}
                </Text>
                <Input
                  placeholder="eg. www.something.com"
                  onChangeText={(text) =>
                    setValue({ ...value, ngo_website: text })
                  }
                />
              </>
            ) : (
              <>
                <Text className="text-sm font-semibold">
                  {t("Enter your name")}
                </Text>
                <Input
                  placeholder="John doe"
                  onChangeText={(text) => setValue({ ...value, name: text })}
                  textContentType="name"
                />

                <Text className="text-sm font-semibold">
                  {t("Enter your age")}
                </Text>
                <Input
                  placeholder="24"
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(text) => setValue({ ...value, age: text })}
                />
              </>
            )}

            <View className="bg-slate-100 p-3 flex gap-3 dark:bg-slate-800 rounded-lg">
              <Text className="text-sm font-semibold">
                {value.role === "ngo"
                  ? t("Official email of ngo")
                  : t("Enter your email")}
              </Text>
              <Input
                placeholder="example@xyz.com"
                onChangeText={(text) => setValue({ ...value, email: text })}
              />

              <Text className="text-center">Or</Text>

              <Text className="text-sm font-semibold">
                {value.role === "ngo"
                  ? t("Official registration number of ngo")
                  : t("Enter your Phone no")}
              </Text>
              <Input
                placeholder="+91 9678908798"
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text) => setValue({ ...value, MobileNo: text })}
              />
            </View>

            <Text className="text-sm font-semibold">
              {value.role === "ngo"
                ? t("Get location of ngo")
                : t("Get your current location")}
            </Text>
            {value?.location?.address ? (
              <Button
                variant="outline"
                onPress={() =>
                  setValue((prev) => ({
                    ...prev,
                    location: {
                      address: "",
                      coordinates: {
                        type: "Point",
                        coordinates: [0, 0],
                      },
                    },
                  }))
                }
              >
                <Text>{value.location.address}</Text>
              </Button>
            ) : (
              <Button
                disabled={isLocationloading}
                onPress={getLocation}
                variant="outline"
              >
                <View className="flex justify-center items-center gap-3 flex-row">
                  {isLocationloading ? (
                    <>
                      <ActivityIndicator animating />
                      <Text>{t("Fetching current location")}...</Text>
                    </>
                  ) : (
                    <>
                      <LucidIcons IconName={MapPin} />
                      <Text>{t("Get current Location")}</Text>
                    </>
                  )}
                </View>
              </Button>
            )}

            <Text className="text-sm font-semibold">{t("Enter password")}</Text>
            <Input
              placeholder="******"
              onChangeText={(text) => setValue({ ...value, password: text })}
              secureTextEntry
              textContentType="password"
            />

            <Text className="text-sm font-semibold">
              {t("Re-Enter password")}
            </Text>
            <Input
              placeholder="******"
              onChangeText={(text) => setValue({ ...value, password1: text })}
              secureTextEntry
              textContentType="password"
            />

            <Button
              variant="secondary"
              className="rounded-full mt-5"
              onPress={signUpHandler}
            >
              <Text>
                {isLoading ? <ActivityIndicator animating /> : t("Sign up")}
              </Text>
            </Button>

            {!!error && (
              <View className="w-full p-4 pt-0">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default SignUp;
