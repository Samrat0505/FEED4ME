import {
  View,
  StatusBar,
  ToastAndroid,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import LucidIcons from "~/components/LucidIcons";
import { ActivityIcon, KeyIcon } from "lucide-react-native";
import axios from "axios";
import { registerUser, verifyOTP } from "~/lib/Api";
import { router } from "expo-router";
import { useGlobalContext } from "~/Context/ContextProvider";
// import auth from "@react-native-firebase/auth";
// import Loader from "~/components/loader";
// import { Image } from "expo-image";
// import Vibrate from "~/lib/Vibrate";
// import { useGlobalContext } from "~/Context/ContextProvider";

const SignUp = () => {
  const [value, setValue] = React.useState({
    name: "",
    email: "",
    MobileNo: "",
    password: "",
    password1: "",
    age: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = Dimensions.get("screen");
  const [isOTPSent, setIsOtpSent] = useState<boolean>(false);
  const { setUser } = useGlobalContext();

  async function signUpHandler() {
    // Vibrate(isHapticFeedBackEnabled);

    if (
      value.email === "" ||
      value.password === "" ||
      value.password1 === "" ||
      value.MobileNo === "" ||
      value.age === "" ||
      value.name === ""
    ) {
      ToastAndroid.show("Fill all required fields", ToastAndroid.SHORT);
      setError("Fill all required fields.");
      return;
    }
    if (value.password1 !== value.password) {
      ToastAndroid.show("Passwords do not match!", ToastAndroid.SHORT);
      setError("Passwords do not match!");
      return;
    }
    setIsLoading(true);

    try {
      const data = await registerUser("farmer", {
        age: parseInt(value.age),
        email: value.email,
        location: "Pantnagar",
        // mobile: parseInt(value.MobileNo),
        mobile: null,
        name: value.name,
        password: value.password,
      });
      data && setIsOtpSent(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  //-------------------------------------------------------
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    if (otp.length !== 5) {
      ToastAndroid.show("Please enter a 5-digit OTP", ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    try {
      const data = await verifyOTP("farmer", value.email, otp);
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
            <Text className="text-2xl font-bold text-gray-800">Enter OTP</Text>
            <Text>Otp sent to your email address - {value.email}</Text>

            <View className="flex-row space-x-2 justify-center">
              {[...Array(5)].map((_, index) => (
                <Input
                  key={index}
                  className="w-12 h-12 text-center border-2 border-muted mx-2 rounded-md"
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(value) => {
                    const newOtp = otp.split("");
                    newOtp[index] = value;
                    setOtp(newOtp.join(""));
                  }}
                />
              ))}
            </View>

            <Button className="m-5" onPress={handleVerifyOTP}>
              <Text className="text-white font-bold text-lg">
                {isLoading ? <ActivityIndicator animating /> : "Verify OTP"}
              </Text>
            </Button>
          </View>
        ) : (
          <View
            className="p-5 flex gap-3 dark:bg-black"
            style={{ paddingTop: StatusBar.currentHeight }}
          >
            <Text className="text-4xl font-bold py-5 pb-0">Sign up</Text>
            <Text className="font-semibold py-5 pt-0 text-muted-foreground">
              create new account account
            </Text>
            {/* <View className="flex items-center justify-center"> */}
            {/* <Image
                source={require("assets/Images/LogIn.svg")}
                style={{ width: width - 60, height: width - 60 }}
                contentFit="contain"
              /> */}
            {/* </View> */}

            <Text className="text-sm font-semibold">Enter your name</Text>
            <Input
              placeholder="John doe"
              onChangeText={(text) => setValue({ ...value, name: text })}
              textContentType="name"
            />
            <Text className="text-sm font-semibold">Enter your email</Text>
            <Input
              placeholder="example@xyz.com"
              onChangeText={(text) => setValue({ ...value, email: text })}
              textContentType="emailAddress"
            />
            <Text className="text-sm font-semibold">Mobile number</Text>
            <Input
              placeholder="+91 9678908798"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => setValue({ ...value, MobileNo: text })}
            />

            <Text className="text-sm font-semibold">Enter your age</Text>
            <Input
              placeholder="24"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={(text) => setValue({ ...value, age: text })}
            />
            <Text className="text-sm font-semibold">Enter password</Text>
            <Input
              placeholder="******"
              onChangeText={(text) => setValue({ ...value, password: text })}
              secureTextEntry={true}
              textContentType="password"
            />
            <Text className="text-sm font-semibold">Re-Enter password</Text>
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
                {isLoading ? <ActivityIndicator animating /> : "Sign up"}
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
