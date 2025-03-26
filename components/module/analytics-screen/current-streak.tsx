import React from "react";
import { StyleSheet, View } from "react-native";
import StreaksIcon from "@/assets/svg/streak-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { useQuery } from "@tanstack/react-query";
import { getHabitStats } from "@/api/api";
import StreakValue from "./streak-value";
type Props = {
  habitId: string;
};
const _iconSize = horizontalScale(24);
const CurrentStreak = ({ habitId }: Props) => {
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(8),
        }}
      >
        <StreaksIcon width={_iconSize} height={_iconSize} />
        <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
          Current Streak
        </ThemedText>
      </View>
      {/* <ThemedText style={{ fontSize: getFontSize(14) }}>
        <ThemedText
          style={{ fontSize: getFontSize(24), fontFamily: "PoppinsSemiBold" }}
        >
          {getHabitStatsQuery.data?.streak ?? 0}
        </ThemedText>
        {"  "}
        Days
      </ThemedText> */}
      <StreakValue streakDays={getHabitStatsQuery.data?.streak ?? 0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(25, 4, 44, 1)",
    width: "100%",
    paddingVertical: verticalScale(24),
    borderRadius: horizontalScale(8),
    alignItems: "center",
    gap: verticalScale(10),
  },
});

export default CurrentStreak;
