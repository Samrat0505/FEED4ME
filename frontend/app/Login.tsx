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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
type UserDetails = {
  email: string;
  password: string;
  mobileNo: string;
  role: "customer" | "farmer" | "storage" | "ngo";
};
const Login = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState<UserDetails>({
    email: "",
    password: "",
    mobileNo: "",
    role: "farmer",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useGlobalContext();

  const submitHandler = async () => {
    // Vibrate(isHapticFeedBackEnabled);

    if (!value.email && value.mobileNo.length !== 10) {
      ToastAndroid.show(
        t("Enter at least Email or phone no"),
        ToastAndroid.SHORT
      );
      setError(t("Enter at least Email or phone no"));
      return;
    }
    if (value.password === "") {
      ToastAndroid.show(t("Fill all required fields"), ToastAndroid.SHORT);
      setError(t("Fill all required fields"));
      return;
    }
    setIsLoading(true);
    try {
      const data = await loginUser(
        value.role,
        value.mobileNo.length === 10 ? value.mobileNo : value.email,
        value.password
      );
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
          <Text className="text-sm font-semibold">{t("Role")}</Text>
          <Select
            onValueChange={(text) => {
              const selectedRole = text?.value as
                | "customer"
                | "farmer"
                | "storage"
                | "ngo";
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
                <SelectItem label={t("Ngo")} value="ngo">
                  {t("Ngo")}
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
              textContentType="emailAddress"
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
                setValue({ ...value, mobileNo: text })
              }
              textContentType="password"
            />
          </View>

          <Text className="text-sm font-semibold">{t("Enter password")}</Text>
          <Input
            placeholder="******"
            onChangeText={(text: string) =>
              setValue({ ...value, password: text })
            }
            secureTextEntry={true}
            textContentType="password"
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
