import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import StreakIcon from "@/assets/svg/streak-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
type Props = {
  streakValue?: number;
};

const HabitStreak = ({ streakValue }: Props) => {
  return (
    <View style={styles.container}>
      <StreakIcon />
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
