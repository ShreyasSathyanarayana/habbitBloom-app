import React, { useState } from "react";
import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
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
import { router } from "expo-router";
import HabitHead from "@/components/module/habit-screen/habit-head";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HabitList from "@/components/module/habit-screen/habit-list";
import { useQuery } from "@tanstack/react-query";
import { getAllHabits } from "@/api/api";
import ServerError from "@/components/module/errors/server-error";
import { useAuth } from "@/context/AuthProvider";
import NoInternet from "@/components/module/errors/no-internet";
import { LinearGradient } from "expo-linear-gradient";

const SCROLL_HIDE_THRESHOLD = 10;
const SCROLL_SHOW_THRESHOLD = -5;

export default function HabitsScreen() {
  const { isTabBarVisible, showTabBar, hideTabBar } = useTabBar();
  const { isConnected } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);
  const [selectedFilter, setSelectedFilter] = useState<
    "latest" | "alphabetical"
  >("latest");

  const getHabitQuery = useQuery({
    queryKey: ["habitList", isConnected, selectedFilter],
    queryFn: () => {
      return getAllHabits(selectedFilter);
    },
    staleTime: 10000,
    refetchOnReconnect: true,
  });
  // console.log("habit list", JSON.stringify(getHabitQuery.data, null, 2));

  useDerivedValue(() => {
    const diffY = scrollY.value - prevScrollY.value;
    if (diffY > SCROLL_HIDE_THRESHOLD) runOnJS(hideTabBar)();
    else if (diffY < SCROLL_SHOW_THRESHOLD) runOnJS(showTabBar)();
    prevScrollY.value = scrollY.value;
  });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isTabBarVisible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    }),
    transform: [
      {
        translateX: withSpring(isTabBarVisible ? 0 : 50, {
          damping: 20,
          stiffness: 150,
        }),
      },
    ],
  }));

  if (!isConnected) return <NoInternet onRefresh={getHabitQuery.refetch} />;
  if (getHabitQuery.status === "error")
    return <ServerError onRefresh={getHabitQuery.refetch} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HabitHead
        selectedFilter={selectedFilter}
        onChangeFilter={(filterName) => setSelectedFilter(filterName)}
        onPressArchive={() => router.push("/(protected)/archive")}
      />

      <HabitList
        scrollY={scrollY}
        isLoading={getHabitQuery.isFetching}
        habitList={getHabitQuery.data}
      />

      {/* Floating Button with Animation */}
      <Animated.View style={[styles.floatingBtnContainer, animatedButtonStyle]}>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-habit")}
          // style={styles.floatingBtn}
        >
          <LinearGradient
            colors={["#8A2BE2", "#34127E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            //   style={styles.card}
            style={{
              width: horizontalScale(56),
              height: horizontalScale(56),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: horizontalScale(50),
            }}
          >
            <PlusIcon />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "black",
  },
  floatingBtnContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? verticalScale(110) : verticalScale(100),
    right: horizontalScale(15),
  },
  floatingBtn: {
    // padding: horizontalScale(12),
    // backgroundColor: "rgba(138, 43, 226, 1)",
    borderRadius: 150,
  },
});
