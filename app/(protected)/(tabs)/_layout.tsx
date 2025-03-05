import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBarProvider } from "@/context/TabBarContext";
// import TabBar from "../components/TabBar";

const _layout = () => {
  return (
    // <SafeAreaView

    //   style={{ flex: 1, backgroundColor: "#000" }}
    // >
    <TabBarProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Habits",
          }}
        />
        <Tabs.Screen
          name="streaks"
          options={{
            title: "Streaks",
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
    </TabBarProvider>
    // </SafeAreaView>
  );
};

export default _layout;
