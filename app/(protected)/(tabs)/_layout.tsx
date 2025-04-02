import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";
import { TabBarProvider } from "@/context/TabBarContext";
import { syncHabits } from "@/services/habitService";


const _layout = () => {
  useEffect(() => {
    syncHabits();
  }, []);
  return (
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
  );
};

export default _layout;
