import React from "react";
import { Stack } from "expo-router";

const ProtectedLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right",
        // animationDuration: 300,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: "habbits" }} />
    </Stack>
  );
};

export default ProtectedLayout;
