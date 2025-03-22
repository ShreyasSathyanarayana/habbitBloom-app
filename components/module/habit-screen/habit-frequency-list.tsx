import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";

export const weekList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  frequency: number[];
};

const HabitFrequencyList = ({ frequency }: Props) => {
  return (
    <View style={styles.container}>
      {frequency.map((day, index) => {
        return (
          <ThemedText
            key={"day-" + day}
            style={{ fontSize: getFontSize(12), color: "rgba(52, 199, 89, 1)" }}
          >
            {index !== 0 && index !== frequency?.length ? ", " : ""}
            {weekList[day]}
          </ThemedText>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
});

export default HabitFrequencyList;
