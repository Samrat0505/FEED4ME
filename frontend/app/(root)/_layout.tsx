import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
        }}
      />
    </Stack>
  );
};

export default Layout;
