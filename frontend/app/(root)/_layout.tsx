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
      route: "(Production)/Production",
      name: "Production Overview",
      headerShown: true,
    },
    {
      route: "(Production)/AddNewCrop",
      name: "Add New Crop",
      headerShown: true,
    },
    {
      route: "Purchase",
      name: "Purchase",
      headerShown: true,
    },
    {
      route: "(storage)/Storage",
      name: "Storage Management",
      headerShown: true,
    },
    {
      route: "(storage)/AddNewInventory",
      name: "Add New Inventory",
      headerShown: true,
    },
    {
      route: "(storage)/InventoriesPurchaseMapView",
      name: "Map view",
      headerShown: false,
    },
    {
      route: "About",
      name: "About",
      headerShown: false,
    },
    {
      route: "(Wastage)/Waste",
      name: "Waste Management",
      headerShown: true,
    },
    {
      route: "(Wastage)/ReportFoodWaste",
      name: "Report Waste",
      headerShown: true,
    },
    {
      route: "(Wastage)/selfWasteReport",
      name: "Your Reported Waste",
      headerShown: true,
    },
    {
      route: "Support",
      name: "Support Center",
      headerShown: true,
    },
    {
      route: "chat/index",
      name: "Chat with Farmers",
      headerShown: true,
    },
    {
      route: "chat/ChatScreen",
      name: "Unknown",
      headerShown: true,
    },
    {
      route: "NewsFeed",
      name: "Daily Updates",
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
