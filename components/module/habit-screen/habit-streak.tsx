import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import StreakIcon from "@/assets/svg/streak-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
// import { Skeleton } from "moti/skeleton";

const _iconSize = horizontalScale(18);
type Props = {
  streakValue?: number;
  isLoading?: boolean;
};

const HabitStreak = ({ streakValue, isLoading }: Props) => {
  return (
    <View style={styles.container}>
      <StreakIcon width={_iconSize} height={_iconSize} />

      <ThemedText
        style={{ fontSize: getFontSize(12), fontFamily: "PoppinsSemiBold" }}
      >
        {streakValue ?? 0}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
});

export default HabitStreak;
