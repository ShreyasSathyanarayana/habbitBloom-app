import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import HabitScroreIcon from "@/assets/svg/habit-score-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
type Props = {
  habitId: string;
};
const _iconSize = horizontalScale(24);

const HabitScore = ({ habitId }: Props) => {
  return (
    <View>
      <View style={styles.row}>
        <HabitScroreIcon width={_iconSize} height={_iconSize} />
        <ThemedText style={{fontSize:getFontSize(12)}}>Habit Score</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(6),
  },
});

export default HabitScore;
