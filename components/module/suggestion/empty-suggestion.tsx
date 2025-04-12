import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyHabit from "@/assets/svg/empty-habit.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";

const EmptySuggestion = () => {
  return (
    <View style={styles.container}>
      <EmptyHabit />
      <ThemedText style={{ fontFamily: "PoppinsMedium", textAlign: "center" }}>
        Help us improve! Tap the + button to send a suggestion or report an
        issue.
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
    gap: verticalScale(24),
    // backgroundColor: "red",
  },
});

export default EmptySuggestion;
