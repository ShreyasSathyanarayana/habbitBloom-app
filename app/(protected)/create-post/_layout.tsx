import React from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // presentation: "modal",
        // animation: "ios_from_right",
        // animationDuration: 300,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Create Post",
          presentation: Platform.OS == "ios" ?"card" : "transparentModal",
        }}
      />
    </Stack>
  );
};

export default Layout;
