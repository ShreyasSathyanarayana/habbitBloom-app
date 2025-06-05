import React from "react";
import { Stack } from "expo-router";

const ProtectedLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
        contentStyle: { backgroundColor: "#000" },
        // animationDuration: 300,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: "habbits" }} />
      <Stack.Screen name="create-habit" options={{ title: "create habit" }} />
      <Stack.Screen
        name="create-post"
        options={{
          title: "Create Post",
          presentation: "modal", // Use 'transparentModal' for iOS if needed
        }}
      />
      {/* <Stack.Screen name="analytics" options={{ title: "Analytics" }} /> */}
    </Stack>
  );
};

export default ProtectedLayout;
