import {
  View,
  StatusBar,
  ToastAndroid,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import LucidIcons from "~/components/LucidIcons";
import { KeyIcon, Sprout } from "lucide-react-native";
// import auth from "@react-native-firebase/auth";
// import Loader from "~/components/loader";
// import { Image } from "expo-image";
// import Vibrate from "~/lib/Vibrate";
// import { useGlobalContext } from "~/Context/ContextProvider";

const Login = () => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    password1: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const { isHapticFeedBackEnabled, isConnected } = useGlobalContext();

  const submitHandler = async () => {
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
    //   //sign in to an existing account with signInWithEmailAndPassword.
    //   await auth()
    //     .signInWithEmailAndPassword(value.email, value.password)
    //     .then(() => {
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
    //       if (error.code === "auth/invalid-credential") {
    //         ToastAndroid.show(
    //           "Entered credential are incorrect",
    //           ToastAndroid.SHORT
    //         );
    //         setError("Entered credential are incorrect");
    //       }
    //       setError(error.message);
    //     });
    // } catch (error) {
    //   setError(error.message);
    // }
    setIsLoading(false);
  };

  return (
    <>
      {/* <Loader visible={isLoading} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="p-5 flex gap-3 dark:bg-black"
          style={{ paddingTop: StatusBar.currentHeight }}
        >
          <Text className="text-4xl font-bold py-5 pb-0">Log in</Text>
          <Text className="font-semibold py-5 pt-0 text-muted-foreground">
            log in to an existing account
          </Text>
          {/*   
            <Image
              source={require("assets/Images/SignIn.svg")}
              style={{ width: width - 50, height: width - 50 }}
              contentFit="contain"
            /> */}
          <View style={{ width: Dimensions.get("screen").width - 50, height: Dimensions.get("screen").height / 3 }} className="flex items-center justify-center">
            <LucidIcons IconName={KeyIcon} size={100} strokeWidth={1.1} />
          </View>

          <Text className="text-sm font-semibold">Enter your email</Text>
          <Input
            placeholder="example@xyz.com"
            onChangeText={(text: string) => setValue({ ...value, email: text })}
          />
          <Text className="text-sm font-semibold">Enter password</Text>
          <Input
            placeholder="******"
            onChangeText={(text: string) => setValue({ ...value, password: text })}
            secureTextEntry={true}
          />
          <Text className="text-sm font-semibold">Re-Enter password</Text>
          <Input
            placeholder="******"
            onChangeText={(text: string) => setValue({ ...value, password1: text })}
            secureTextEntry={true}
          />

          <Button
            variant="secondary"
            className="rounded-full mt-5"
            onPress={submitHandler}
          >
            <Text>Login</Text>
          </Button>
          <View className="mb-5">
            {!!error && (
              <View className="w-full">
                <Text className="text-red-500 text-sm text-center">
                  {error}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView >
    </>
  );
};

export default Login;
