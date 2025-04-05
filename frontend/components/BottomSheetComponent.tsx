import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { BackHandler, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "~/lib/useColorScheme";
import { useFocusEffect } from "expo-router";
import { Text } from "./ui/text";

export type Ref = BottomSheet;

interface Props {
  title: string;
  subTitle: string;
  children: ReactElement;
  BottomSheetFooterComponent?: ReactElement;
  backdropOpacity?: number;
}

const BottomSheetComponent = forwardRef<Ref, Props>((props, ref) => {
  const { isDarkColorScheme } = useColorScheme();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSheetOpen) {
          (ref as React.MutableRefObject<BottomSheet>).current?.close();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isSheetOpen])
  );

  const BackdropComponent = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={5}
        appearsOnIndex={-1}
        enableTouchThrough={false}
        pressBehavior="close"
        opacity={props.backdropOpacity ? props.backdropOpacity : 0}
      />
    ),
    []
  );

  const FooterComponent = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <BottomSheetFooter {...footerProps}>
        <View className="px-4 w-full bg-white dark:bg-[#1f2937] py-2">
          {props.BottomSheetFooterComponent}
        </View>
      </BottomSheetFooter>
    ),
    [props.BottomSheetFooterComponent]
  );

  const backgroundStyle = useMemo(
    () => ({ backgroundColor: isDarkColorScheme ? "#1f2937" : "white" }),
    [isDarkColorScheme]
  );
  const handleIndicatorStyle = useMemo(
    () => ({ backgroundColor: isDarkColorScheme ? "white" : "black" }),
    [isDarkColorScheme]
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      onChange={(index) => setIsSheetOpen(index >= 0)}
      enablePanDownToClose={true}
      enableDynamicSizing={true}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      backdropComponent={BackdropComponent}
      footerComponent={FooterComponent}
      topInset={100}
    >
      <BottomSheetScrollView>
        <Text className="text-center text-2xl mt-2 font-semibold">
          {props.title}
        </Text>
        <Text className="text-center mb-3 text-slate-500 px-3">
          {props.subTitle}
        </Text>
        <View>{props.children}</View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetComponent;
