import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, }}
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
