import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ScrollableContainer from "@/components/ui/scrollable-container";
import PlusIcon from "@/assets/svg/plus-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { useTabBar } from "@/context/TabBarContext";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SheetManager } from "react-native-actions-sheet";

export default function HabitsScreen() {
  const { isTabBarVisible } = useTabBar();
  const buttonOpacity = useSharedValue(isTabBarVisible ? 1 : 0);
  const buttonTranslation = useSharedValue(isTabBarVisible ? 0 : 50);

  useEffect(() => {
    buttonOpacity.value = withSpring(isTabBarVisible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });

    buttonTranslation.value = withSpring(isTabBarVisible ? 0 : 50, {
      damping: 20,
      stiffness: 150,
    });
  }, [isTabBarVisible]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateX: buttonTranslation.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollableContainer>
        {[...Array(20).keys()].map((item) => (
          <View key={item} style={styles.itemContainer}>
            <Text style={styles.text}>Item {item}</Text>
          </View>
        ))}
      </ScrollableContainer>

      {/* Floating Button with Animation */}
      <Animated.View style={[styles.floatingBtnContainer, animatedButtonStyle]}>
        <TouchableOpacity
          onPress={() => SheetManager.show("create-habit")}
          style={styles.floatingBtn}
        >
          <PlusIcon />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 100,
    backgroundColor: "#222",
    marginBottom: 10,
    justifyContent: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  floatingBtnContainer: {
    position: "absolute",
    bottom: verticalScale(100),
    right: horizontalScale(15),
  },
  floatingBtn: {
    padding: horizontalScale(12),
    backgroundColor: "rgba(138, 43, 226, 1)",
    borderRadius: 150,
  },
});
