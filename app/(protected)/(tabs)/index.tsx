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
import { router } from "expo-router";
import HabitHead from "@/components/module/habit-screen/habit-head";
import HabitList from "@/components/module/habit-screen/habit-list";

export default function HabitsScreen() {
  const { isTabBarVisible } = useTabBar();
  const buttonOpacity = useSharedValue(isTabBarVisible ? 1 : 0);
  const buttonTranslation = useSharedValue(isTabBarVisible ? 0 : 50);
  const [selectedWeek, setSelectedWeek] = useState<number>(new Date().getDay());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

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

  const onWeekChange = (weekNumber: number, date: string) => {
    setSelectedWeek(weekNumber);
    setSelectedDate(date);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollableContainer>
        <View style={{ paddingHorizontal: horizontalScale(16) }}>
          <HabitHead
            selectedWeek={selectedWeek}
            onPress={(val, date) => onWeekChange(val, date)}
          />
          <HabitList selectedWeek={selectedWeek}  selectedDate={selectedDate} />
        </View>
      </ScrollableContainer>

      {/* Floating Button with Animation */}
      <Animated.View style={[styles.floatingBtnContainer, animatedButtonStyle]}>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-habit")}
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
    bottom: Platform.OS === "ios" ? verticalScale(110) : verticalScale(100),
    right: horizontalScale(15),
  },
  floatingBtn: {
    padding: horizontalScale(12),
    backgroundColor: "rgba(138, 43, 226, 1)",
    borderRadius: 150,
  },
});
