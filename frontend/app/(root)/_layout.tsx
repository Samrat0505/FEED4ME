import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  const Screens = [
    {
      route: "Dashboard",
      name: "Dashboard",
      headerShown: false,
    },
    {
      route: "Profile",
      name: "Profile",
      headerShown: false,
    },
    {
      route: "Production",
      name: "Production Overview",
      headerShown: true,
    },
    {
      route: "Transport",
      name: "Transport Hub",
      headerShown: true,
    },
    {
      route: "(storage)/Storage",
      name: "Storage Management",
      headerShown: false,
    },
    {
      route: "About",
      name: "About",
      headerShown: false,
    },
    {
      route: "Waste",
      name: "Waste Management",
      headerShown: true,
    },
    {
      route: "ContactUs",
      name: "Support Center",
      headerShown: true,
    },
  ];
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      {Screens.map(({ name, headerShown, route }) => {
        return (
          <Stack.Screen
            key={name}
            name={route}
            options={{
              title: name,
              headerShown: headerShown,
            }}
          />
        );
      })}
    </Stack>
  );
};

export default Layout;
