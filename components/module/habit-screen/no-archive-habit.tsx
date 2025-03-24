import React from "react";
import { StyleSheet, View } from "react-native";
import NoArchiveHabitIcon from "@/assets/svg/no-archive-habit-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";

const _iconSize = horizontalScale(300);

const NoArchiveHabit = () => {
  return (
    <View style={styles.container}>
      <NoArchiveHabitIcon width={_iconSize} height={_iconSize} />
      <ThemedText style={{ textAlign: "center" }}>
        No habits archived yet! Move habits here to hide them and bring them
        back anytime.
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(16),
    // backgroundColor: "red",
    // gap: verticalScale(32),
  },
});

export default NoArchiveHabit;
