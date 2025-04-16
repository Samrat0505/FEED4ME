import React from "react";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import LucidIcons from "~/lib/LucidIcons";
import { Camera, ImageIcon } from "lucide-react-native";

type ImagePickerComponentProps = {
  image: ImagePicker.ImagePickerSuccessResult | null;
  setImage: (image: ImagePicker.ImagePickerSuccessResult | null) => void;
};

export default function ImagePickerComponent({
  image,
  setImage,
}: ImagePickerComponentProps) {
  const { colorScheme } = useColorScheme();
  const { width } = useWindowDimensions();

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        aspect: [1, 1],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <>
      {image ? (
        <View className="relative rounded-md">
          <Pressable
            className="bg-stone-200 p-1 rounded-full absolute top-2 right-2 z-20"
            onPress={() => setImage(null)}
          >
            <Ionicons name="close-sharp" size={30} color="black" />
          </Pressable>
          <Image
            source={{ uri: image.assets[0]?.uri }}
            className="rounded-md mb-5 w-full"
            style={{ aspectRatio: 1 }}
          />
        </View>
      ) : (
        <View className="flex justify-center items-center my-2">
          <TouchableOpacity
            onPress={takePhoto}
            className={`flex-row items-center border border-muted rounded-md p-3 mb-2 `}
          >
            <Text className="flex-1 text-gray-700">Take photo</Text>
            <LucidIcons IconName={Camera} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            className={`flex-row items-center border  border-muted rounded-md p-3 mb-2 `}
          >
            <Text className="flex-1 text-gray-700">Select photo</Text>
            <LucidIcons IconName={ImageIcon} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    maxWidth: 400,
  },
});
