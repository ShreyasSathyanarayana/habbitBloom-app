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
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SheetManager } from "react-native-actions-sheet";
import { router } from "expo-router";
import HabitHead from "@/components/module/habit-screen/habit-head";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HabitCard from "@/components/module/habit-screen/habit-card";
import HabitList from "@/components/module/habit-screen/habit-list";
import HabitEmpty from "@/components/module/habit-screen/habit-empty";
import { useQuery } from "@tanstack/react-query";
import { getAllHabits } from "@/api/api";
import ServerError from "@/components/module/errors/server-error";
import { useAuth } from "@/context/AuthProvider";
import NoInternet from "@/components/module/errors/no-internet";
const SCROLL_HIDE_THRESHOLD = 10; // Minimum scroll distance before hiding
const SCROLL_SHOW_THRESHOLD = -5; // Threshold for showing the tab bar

export default function HabitsScreen() {
  const { isTabBarVisible, showTabBar, hideTabBar } = useTabBar();
  const buttonOpacity = useSharedValue(isTabBarVisible ? 1 : 0);
  const buttonTranslation = useSharedValue(isTabBarVisible ? 0 : 50);
  const { isConnected } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);
  const gethabitQuery = useQuery({
    queryKey: ["habitList", isConnected],
    queryFn: getAllHabits,
    enabled: isConnected,
  });

  useDerivedValue(() => {
    const diffY = scrollY.value - prevScrollY.value;

    if (diffY > SCROLL_HIDE_THRESHOLD) {
      runOnJS(hideTabBar)();
    } else if (diffY < SCROLL_SHOW_THRESHOLD) {
      runOnJS(showTabBar)();
    }

    // Update previous Y position
    prevScrollY.value = scrollY.value;
  });

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

  if (!isConnected) {
    return <NoInternet onRefresh={() => gethabitQuery?.refetch()} />;
  }

  if (gethabitQuery?.status === "error") {
    console.log(gethabitQuery?.isError);

    return <ServerError onRefresh={() => gethabitQuery?.refetch()} />;
  }

  // if (gethabitQuery?.data?.length === 0) {
  //   return <HabitEmpty />;
  // }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: horizontalScale(16),
        backgroundColor: "black",
        paddingTop: insets.top,
      }}
    >
      <HabitHead onPressArchive={() => router.push("/(protected)/archive")} />
      {gethabitQuery?.data?.length === 0 && <HabitEmpty />}
      {gethabitQuery?.data?.length !== 0 && (
        <HabitList
          scrollY={scrollY}
          isLoading={gethabitQuery.isLoading}
          habitList={gethabitQuery?.data}
        />
      )}

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
