import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { useTabBar } from "@/context/TabBarContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScrollableContainer from "@/components/ui/scrollable-container";
// import { StatusBar } from "expo-status-bar";
const SCROLL_THRESHOLD = 20;
const SCROLL_HIDE_THRESHOLD = 5; // Scroll threshold to trigger hide
const SCROLL_SHOW_THRESHOLD = -1; // Scroll threshold to trigger show

export default function HabitsScreen() {
  return (
    <ScrollableContainer>
      {[...Array(20).keys()].map((item) => (
        <View
          key={item}
          style={{
            height: 100,
            backgroundColor: "#222",
            marginBottom: 10,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Item {item}
          </Text>
        </View>
      ))}
    </ScrollableContainer>
  );
}
