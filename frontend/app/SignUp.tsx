import {
  View,
  StatusBar,
  ToastAndroid,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import LucidIcons from "~/components/LucidIcons";
import { KeyIcon } from "lucide-react-native";
// import auth from "@react-native-firebase/auth";
// import Loader from "~/components/loader";
// import { Image } from "expo-image";
// import Vibrate from "~/lib/Vibrate";
// import { useGlobalContext } from "~/Context/ContextProvider";

const SignUp = () => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    password1: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = Dimensions.get("screen");
  // const { isHapticFeedBackEnabled, isConnected } = useGlobalContext();

  async function signUp() {
    // Vibrate(isHapticFeedBackEnabled);


    if (value.email === "" || value.password === "" || value.password1 === "") {
      ToastAndroid.show("Email and password are mandatory", ToastAndroid.SHORT);
      setError("Email and password are mandatory.");
      return;
    }
    if (value.password1 !== value.password) {
      ToastAndroid.show("Passwords do not match!", ToastAndroid.SHORT);
      setError("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    // try {
    //   await auth()
    //     .createUserWithEmailAndPassword(value.email, value.password)
    //     .then((e) => {
    //       setError(null);
    //       ToastAndroid.show("Signed in!", ToastAndroid.SHORT);
    //     })
    //     .catch((error) => {
    //       if (error.code === "auth/email-already-in-use") {
    //         ToastAndroid.show(
    //           "That email address is already in use!",
    //           ToastAndroid.SHORT
    //         );
    //         setError("That email address is already in use!");
    //       }

    //       if (error.code === "auth/invalid-email") {
    //         ToastAndroid.show(
    //           "That email address is invalid!",
    //           ToastAndroid.SHORT
    //         );
    //         setError("That email address is invalid!");
    //       }

    //       setError(error.message);
    //     });
    // } catch (error) {
    //   setError(error.message);
    // }
    setIsLoading(false);
  }

  return (
    <>
      {/* <Loader visible={isLoading} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <View style={{ width: Dimensions.get("screen").width - 50, height: Dimensions.get("screen").height / 3 }} className="flex items-center justify-center">
            <LucidIcons IconName={KeyIcon} size={100} strokeWidth={1.1} />
          </View>

          <Text className="text-sm font-semibold">Enter your email</Text>
          <Input
            placeholder="example@xyz.com"
            onChangeText={(text) => setValue({ ...value, email: text })}
          />
          <Text className="text-sm font-semibold">Enter password</Text>
          <Input
            placeholder="******"
            onChangeText={(text) => setValue({ ...value, password: text })}
            secureTextEntry={true}
          />
          <Text className="text-sm font-semibold">Re-Enter password</Text>
          <Input
            placeholder="******"
            onChangeText={(text) => setValue({ ...value, password1: text })}
            secureTextEntry={true}
          />

          <Button
            variant="secondary"
            className="rounded-full mt-5"
            onPress={signUp}
          >
            <Text>Sign up</Text>
          </Button>

          <View className="mb-5">
            {!!error && (
              <View className="w-full p-4 pt-0">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default SignUp;
