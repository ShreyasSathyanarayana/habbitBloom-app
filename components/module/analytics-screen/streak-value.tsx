import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  streakDays: number;
};

const StreakValue = ({ streakDays }: Props) => {
  return (
    <ThemedText style={{ fontSize: getFontSize(14) }}>
      <ThemedText
        style={{ fontSize: getFontSize(24), fontFamily: "PoppinsSemiBold" }}
      >
        {streakDays}
      </ThemedText>{" "}
      {streakDays > 1 ? "days" : "day"}{" "}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    gap: horizontalScale(2),
    alignItems: "center",
  },
});

export default StreakValue;
