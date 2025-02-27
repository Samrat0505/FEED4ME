import { Dimensions, ScrollView, StatusBar, View } from "react-native";
import React, { useState } from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import Loader from "~/components/loader";
// import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import LucidIcons from "~/components/LucidIcons";
import { Sprout } from "lucide-react-native";
// import Vibrate from "~/lib/Vibrate";
// import { useGlobalContext } from "~/Context/ContextProvider";

// GoogleSignin.configure({
//   webClientId:
//     "229678021106-fq82irbpt3a73jsfq85nblu9b8hkn9l9.apps.googleusercontent.com",
// });

// auth().sendPasswordResetEmail
// auth().sendSignInLinkToEmail
const MainScreen = () => {
  const { height, width } = Dimensions.get("screen");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { isHapticFeedBackEnabled } = useGlobalContext();

  async function onGoogleButtonPress() {
    // Vibrate(isHapticFeedBackEnabled);
    // setIsLoading(true);

    // try {
    //   await GoogleSignin.hasPlayServices({
    //     showPlayServicesUpdateDialog: true,
    //   });
    //   const signInResult = await GoogleSignin.signIn();

    //   var idToken = signInResult.data?.idToken;
    //   if (!idToken) {
    //     idToken = signInResult.data.idToken;
    //   }
    //   if (!idToken) {
    //   }

    //   const googleCredential = auth.GoogleAuthProvider.credential(
    //     signInResult.data.idToken
    //   );
    //   return auth().signInWithCredential(googleCredential);
    // } catch (error) {
    //   setIsLoading(false);
    //   return null;
    // } finally {
    // }
  }

  return (
    <>
      {/* <Loader visible={isLoading} /> */}
      <ScrollView>
        <View className="flex-1 dark:bg-black">
          <View
            style={{
              paddingTop: StatusBar.currentHeight,
            }}
            className="flex items-center justify-center"
          >
            {/* <Image
              source={require("assets/Images/HomeImage.svg")}
              style={{ width: width - 50, height: height / 2 }}
              contentFit="contain"
            /> */}
            <View style={{ width: width - 50, height: height / 2 }} className="flex items-center justify-center">
              <LucidIcons IconName={Sprout} size={100} strokeWidth={1.1} />
            </View>
            <Text className="text-3xl font-bold">Lets you in</Text>
          </View>

          <Button
            variant="outline"
            className="m-5 mt-10 rounded-full flex flex-row items-center justify-center gap-3"
            onPress={onGoogleButtonPress}
          >
            <AntDesign name="google" size={20} color="black" />
            <Text>Sign in with google </Text>
          </Button>

          <Text className="text-center">Or</Text>
          <Button
            variant="secondary"
            className="m-5 rounded-full mb-1"
            onPress={() => {
              // Vibrate(isHapticFeedBackEnabled);
              router.push("/Login");
            }}
          >
            <Text>Sign in with password</Text>
          </Button>

          <Button
            variant="link"
            className="rounded-full"
            onPress={() => {
              // Vibrate(isHapticFeedBackEnabled);
              router.push("/SignUp");
            }}
          >
            <Text>
              don't have a account? {"  "}
              <Text className="text-blue-700 underline">Sign up</Text>
            </Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default MainScreen;
