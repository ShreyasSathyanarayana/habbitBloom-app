import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // animation: "ios_from_right",
        // animationDuration: 300,
        // animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen name="index" options={{ title: "habbits" }} />
      <Stack.Screen
        name="habit-instruction"
        options={{ title: "Habit instruction", presentation: "modal" }}
      />
    </Stack>
  );
};

export default Layout;
