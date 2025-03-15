import React from "react";
import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "~/lib/useColorScheme";

const LucidIcons = ({
  IconName,
  size,
  color,
}: {
  IconName: LucideIcon;
  size?: number;
  color?: string;
}) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <IconName
      size={size ?? 17}
      color={color ? color : !isDarkColorScheme ? "black" : "white"}
    />
  );
};

export default LucidIcons;
