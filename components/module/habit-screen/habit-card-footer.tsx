import { horizontalScale } from "@/metric";
import React, { useCallback } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import CalenderIcon from "@/assets/svg/calender-icon.svg";
import StatsIcon from "@/assets/svg/stats-icon.svg";
import ThreeDotIcon from "@/assets/svg/three-dots.svg";
import { useQuery } from "@tanstack/react-query";
import { getHabitStats } from "@/api/api";
import HabitStreak from "./habit-streak";
import HabitComplete from "./habit-complete";
import { router } from "expo-router";

type Props = {
  habitId: string;
  onPressThreeDot: () => void;
};

const _iconSize = horizontalScale(20);

const HabitCardFooter = ({ habitId, onPressThreeDot }: Props) => {
  // Optimize API query with caching and data selection
  const { data, isLoading } = useQuery({
    queryKey: ["habit-stats", habitId],
    queryFn: () => getHabitStats(habitId),
    enabled: !!habitId,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    select: (data) => ({
      streak: data.streak,
      completed: data.completed,
      notCompleted: data.notCompleted,
    }),
  });

  // Optimize handlers using useCallback to avoid re-renders
  const navigateToCalendar = useCallback(() => {
    router.push(`/(protected)/analytics?id=${habitId}&category=Calendar`);
  }, [habitId]);

  const navigateToStatistics = useCallback(() => {
    router.push(`/(protected)/analytics?id=${habitId}&category=Statistics`);
  }, [habitId]);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <HabitStreak streakValue={data?.streak} isLoading={isLoading} />
        <HabitComplete
          completedValue={data?.completed}
          notCompletedValue={data?.notCompleted}
          isLoading={isLoading}
        />
      </View>
      <View style={styles.column}>
        <TouchableHighlight
          onPress={navigateToCalendar}
          style={styles.iconWrapper}
        >
          <CalenderIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={navigateToStatistics}
          style={styles.iconWrapper}
        >
          <StatsIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={onPressThreeDot}
          style={styles.iconWrapper}
        >
          <ThreeDotIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(16),
  },
  iconWrapper: {
    paddingVertical: horizontalScale(5),
  },
});

export default HabitCardFooter;
