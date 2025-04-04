import React from "react";
import { StyleSheet, View } from "react-native";
import CompletedHabitsEmptyIcon from "@/assets/svg/completed-habits-empty-icon.svg";
import { horizontalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
const _iconSize = horizontalScale(300);
const EmptyCompletedHabits = () => {
  return (
    <View style={styles.container}>
      <CompletedHabitsEmptyIcon width={_iconSize} height={_iconSize} />
      <ThemedText style={{ fontFamily: "PoppinsMedium", textAlign: "center" }}>
        No completed tasks yet! ✅ Keep going and you’ll see them here soon.
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
  },
});

export default EmptyCompletedHabits;
