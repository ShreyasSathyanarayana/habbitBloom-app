import { horizontalScale } from "@/metric";
import React from "react";
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
const _iconWidth = horizontalScale(20);
const _iconHeight = horizontalScale(20);
const HabitCardFooter = ({ habitId, onPressThreeDot }: Props) => {
  const getHabitStatsQuery = useQuery({
    queryKey: ["habit-stats", habitId],
    queryFn: () => {
      return getHabitStats(habitId);
    },
    enabled: !!habitId,
  });
  // console.log("habit stats", JSON.stringify(getHabitStatsQuery.data, null, 2));

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <HabitStreak
          streakValue={getHabitStatsQuery.data?.streak}
          isLoading={getHabitStatsQuery?.isLoading}
        />
        <HabitComplete
          completedValue={getHabitStatsQuery.data?.completed}
          notCompletedValue={getHabitStatsQuery.data?.notCompleted}
          isLoading={getHabitStatsQuery?.isLoading}
        />
      </View>
      <View style={styles.column}>
        <TouchableHighlight
          onPress={() =>
            router.push(
              `/(protected)/analytics?id=${habitId}&category=Calendar`
            )
          }
          style={{ paddingVertical: horizontalScale(5) }}
        >
          <CalenderIcon width={_iconWidth} height={_iconHeight} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            router.push(
              `/(protected)/analytics?id=${habitId}&category=Statistics`
            )
          }
          style={{ paddingVertical: horizontalScale(5) }}
        >
          <StatsIcon width={_iconWidth} height={_iconHeight} />
        </TouchableHighlight>
        <TouchableHighlight
          style={{ paddingVertical: horizontalScale(5) }}
          onPress={onPressThreeDot}
        >
          <ThreeDotIcon width={_iconWidth} height={_iconHeight} />
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
});

export default HabitCardFooter;
