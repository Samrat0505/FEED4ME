import {
  View,
  StatusBar,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { loginUser } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useGlobalContext();

  const submitHandler = async () => {
    // Vibrate(isHapticFeedBackEnabled);

    if (value.email === "" || value.password === "") {
      ToastAndroid.show("Email and password are mandatory", ToastAndroid.SHORT);
      setError("Email and password are mandatory.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser("farmer", value.email, value.password);
      data && setUser({ user: data?.data, token: data?.token });
    } catch (error) {}

    setIsLoading(false);
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="p-5 flex gap-3 dark:bg-black"
          style={{ paddingTop: StatusBar.currentHeight }}
        >
          <Text className="text-4xl font-bold py-5 pb-0">{t("Log in")}</Text>
          <Text className="font-semibold py-5 pt-0 text-muted-foreground">
            {t("log in to an existing account")}
          </Text>
          {/*   
            <Image
              source={require("assets/Images/SignIn.svg")}
              style={{ width: width - 50, height: width - 50 }}
              contentFit="contain"
            /> */}

          <Text className="text-sm font-semibold">{t("Enter your email")}</Text>
          <Input
            placeholder="example@xyz.com"
            onChangeText={(text: string) => setValue({ ...value, email: text })}
          />
          <Text className="text-sm font-semibold">{t("Enter password")}</Text>
          <Input
            placeholder="******"
            onChangeText={(text: string) =>
              setValue({ ...value, password: text })
            }
            secureTextEntry={true}
          />

          <Button
            variant="secondary"
            className="rounded-full mt-5"
            onPress={submitHandler}
          >
            <Text>
              {isLoading ? <ActivityIndicator animating /> : `${t("Login")}`}
            </Text>
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
      </ScrollView>
    </>
  );
};

export default Login;
