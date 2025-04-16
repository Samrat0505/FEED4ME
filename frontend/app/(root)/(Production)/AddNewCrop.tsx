import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { addNewCrop, Crop } from "~/lib/Api";
import { useGlobalContext } from "~/Context/ContextProvider";
import { router } from "expo-router";
import { Crops } from "~/lib/constants";

const AddNewCrop = () => {
  const { user } = useGlobalContext();
  const [crop, setcrop] = useState<Crop>({ MRP: "", name: "", stock: "" });
  const [submitLoading, setsubmitLoading] = useState<boolean>(false);

  const submitHandler = async () => {
    if (!crop.name) {
      ToastAndroid.show("Please enter a crop name", ToastAndroid.LONG);
      return;
    }

    if (!crop.stock) {
      ToastAndroid.show("Please enter the stock quantity", ToastAndroid.LONG);
      return;
    }

    if (!crop.MRP) {
      ToastAndroid.show("Please enter the MRP", ToastAndroid.LONG);
      return;
    }

    setsubmitLoading(true);
    await addNewCrop(user.token, {
      MRP: crop.MRP,
      name: crop.name,
      stock: crop.stock,
    });
    router.back();
    setsubmitLoading(false);
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex px-3 gap-2 ">
          <View className="border border-muted rounded-xl p-2">
            <View className="flex items-center justify-start flex-wrap flex-row">
              {Crops.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    className={cn(
                      "m-1 border border-muted rounded-full py-1 px-2",
                      crop.name === item.name && "bg-slate-200"
                    )}
                    onPress={() =>
                      setcrop((prev) => ({ ...prev, name: item.name }))
                    }
                  >
                    <Text>
                      {item.emoji} {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="text-sm mb-2">Enter name of crop</Text>
            <Input
              placeholder="eg wheat, gehu"
              value={crop.name}
              onChangeText={(text) =>
                setcrop((prev) => ({ ...prev, name: text }))
              }
            />
          </View>

          <Text className="text-sm">Enter stock (in Kg) of crop</Text>
          <Input
            placeholder="500"
            keyboardType="number-pad"
            value={crop.stock}
            onChangeText={(text) =>
              setcrop((prev) => ({ ...prev, stock: text }))
            }
          />
          <Text className="text-sm">
            Enter Maximun retail price (MRP) of crop
          </Text>

          <Input
            placeholder="100 INR"
            keyboardType="number-pad"
            value={crop.MRP}
            onChangeText={(text) => setcrop((prev) => ({ ...prev, MRP: text }))}
          />
          <Button
            variant={"secondary"}
            onPress={submitHandler}
            className="my-5"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <ActivityIndicator animating />
            ) : (
              <Text>Submit</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewCrop;
