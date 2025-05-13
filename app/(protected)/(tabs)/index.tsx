import React, { useEffect, useState } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { horizontalScale, verticalScale } from "@/metric";
import { useTabBar } from "@/context/TabBarContext";
import { useAuth } from "@/context/AuthProvider";
import { getAllHabits } from "@/api/api";
import { useHabitStore } from "@/store/habit-store";
import HabitHead from "@/components/module/habit-screen/habit-head";
import HabitList from "@/components/module/habit-screen-v2/habit-list";
import ServerError from "@/components/module/errors/server-error";
import NoInternet from "@/components/module/errors/no-internet";
import AllowPermissionModal from "@/components/modal/allow-permission-modal";
import { HabitProp } from "@/components/module/habit-screen/habit-card";
import AddButton from "@/components/module/habit-screen-v2/add-button";
// import HabitList from "@/components/module/habit-screen/habit-list";

const SCROLL_HIDE_THRESHOLD = 10;
const SCROLL_SHOW_THRESHOLD = -5;
const HABIT_LIMIT = 5;

export default function HabitsScreen() {
  const { showTabBar, hideTabBar } = useTabBar();
  const { isConnected } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);

  const selectedFilter = useHabitStore((state) => state.selectedFilter);
  const [showNotificationPermissionModal, setShowNotificationPermissionModal] =
    useState(false);

  // === Notification Permission ===
  // useEffect(() => {
  //   const checkPermission = async () => {
  //     const { status } = await Notifications.getPermissionsAsync();
  //     setShowNotificationPermissionModal(status === "denied");
  //   };
  //   checkPermission();
  // }, []);

  // === Data Fetching ===
  const getHabitQuery = useInfiniteQuery({
    queryKey: ["habitList", isConnected, selectedFilter],
    queryFn: ({ pageParam = 1 }) =>
      getAllHabits(selectedFilter, pageParam, HABIT_LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length < HABIT_LIMIT ? undefined : allPages.length + 1,
  });

  const onRefreshList = () => {
    getHabitQuery.refetch();
  };

  // === Hide/Show TabBar on Scroll ===
  useDerivedValue(() => {
    const deltaY = scrollY.value - prevScrollY.value;
    if (deltaY > SCROLL_HIDE_THRESHOLD) runOnJS(hideTabBar)();
    else if (deltaY < SCROLL_SHOW_THRESHOLD) runOnJS(showTabBar)();
    prevScrollY.value = scrollY.value;
  }, []);

  // === UI Rendering ===
  if (!isConnected) return <NoInternet onRefresh={onRefreshList} />;
  if (getHabitQuery.status === "error")
    return <ServerError onRefresh={onRefreshList} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HabitHead
        selectedFilter={selectedFilter}
        onPressArchive={() => router.push("/(protected)/archive")}
      />

      <HabitList
        scrollY={scrollY}
        isLoading={
          getHabitQuery.isFetching && !getHabitQuery.isFetchingNextPage
        }
        isRefreshing={getHabitQuery.isFetchingNextPage}
        habitList={(getHabitQuery.data?.pages ?? []).flat() as HabitProp[]}
        onRefresh={onRefreshList}
        isNextPageAvailable={getHabitQuery.hasNextPage}
        onScrollEnd={getHabitQuery.fetchNextPage}
        isFetchingNextPage={getHabitQuery.isFetchingNextPage}
      />

      <AllowPermissionModal
        isModalVisible={showNotificationPermissionModal}
        permissionType="Notifications"
        onClose={() => setShowNotificationPermissionModal(false)}
      />

      {/* Floating Add Habit Button */}
      <AddButton />
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
    width: horizontalScale(56),
    height: horizontalScale(56),
    borderRadius: horizontalScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
});
