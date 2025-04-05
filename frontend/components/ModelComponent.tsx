import React from "react";
import { View, StatusBar, Modal, useWindowDimensions } from "react-native";

interface ModelComponentProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  children: React.ReactNode;
  animation?: "slide" | "none" | "fade";
  onCloseHandler?: () => void;
  closeOnBack?: boolean;
  Modelheight?: number;
}

const ModelComponent: React.FC<ModelComponentProps> = ({
  isVisible,
  setIsVisible,
  children,
  animation = "slide",
  onCloseHandler,
  closeOnBack = true,
  Modelheight = 1,
}) => {
  const { height, width } = useWindowDimensions();

  const closeHandler = () => {
    if (onCloseHandler) onCloseHandler();
    if (closeOnBack) setIsVisible(false);
  };

  return (
    <View>
      <Modal
        animationType={animation}
        visible={isVisible}
        transparent={false}
        statusBarTranslucent
        onRequestClose={closeHandler}
      >
        <View
          style={{
            paddingTop: (StatusBar.currentHeight || 0) + 10,
            height: height * Modelheight + (StatusBar.currentHeight || 0),
            width,
          }}
          className="bg-white dark:bg-black"
        >
          {children}
        </View>
      </Modal>
    </View>
  );
};

export default ModelComponent;
