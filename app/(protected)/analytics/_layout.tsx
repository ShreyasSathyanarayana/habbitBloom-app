import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right",
        // animationDuration: 300,
      }}
    >
      <Stack.Screen name="index" options={{ title: "habbits" }} />
    </Stack>
  );
};

export default Layout;
