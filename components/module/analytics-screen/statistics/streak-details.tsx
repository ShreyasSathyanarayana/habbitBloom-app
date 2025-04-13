import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import StreakIcon from "@/assets/svg/streak-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { useQuery } from "@tanstack/react-query";
import { getHabitStats } from "@/api/api";
import StreakValue from "../streak-value";
import { Divider } from "@rneui/base";
type Props = {
  habitId: string;
};

const StreakDetails = ({ habitId }: Props) => {
  const getHabitStatsQuery = useQuery({
    queryKey: ["habit-stats", habitId],
    queryFn: () => {
      return getHabitStats(habitId);
    },
    enabled: !!habitId,
  });
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(8),
          paddingBottom: verticalScale(16),
        }}
      >
        <StreakIcon />
        <ThemedText style={{ fontSize: getFontSize(12) }}>Streak</ThemedText>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          // justifyContent: "center",
          paddingBottom: verticalScale(16),
        }}
      >
        <View style={styles.column}>
          <ThemedText style={styles.title}>Current</ThemedText>
          <StreakValue streakDays={getHabitStatsQuery?.data?.streak ?? 0} />
        </View>

        <Divider
          style={{
            // backgroundColor: "red",
            width: verticalScale(90),
            transform: [{ rotate: "90deg" }],
          }}
        />

        <View style={styles.column}>
          <ThemedText style={styles.title}>Best</ThemedText>
          <StreakValue
            streakDays={getHabitStatsQuery?.data?.highestStreak ?? 0}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(25, 4, 44, 1)",
    padding: horizontalScale(9),
    borderRadius: horizontalScale(8),
    paddingBottom: verticalScale(24),
  },
  title: {
    fontFamily: "PoppinsSemiBold",
  },
  numberStyle: {
    fontSize: getFontSize(24),
    fontFamily: "PoppinsSemiBold",
  },
  column: {
    alignItems: "center",
  },
});

export default StreakDetails;
