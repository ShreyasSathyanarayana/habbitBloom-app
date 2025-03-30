import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyHabit from "@/assets/svg/empty-habit.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
const _iconSize = horizontalScale(300);

const HabitEmpty = () => {
  return (
    <View style={styles.container}>
      <View style={{ gap: verticalScale(16) }}>
        <EmptyHabit width={_iconSize} height={_iconSize} />
        <ThemedText
          style={{ textAlign: "center", fontFamily: "PoppinsMedium" }}
        >
          No habits yet! Begin your journey by adding one.
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "black",
    paddingHorizontal: horizontalScale(16),
    marginTop: verticalScale(80),
    // justifyContent: "space-evenly",
  },
});

export default HabitEmpty;
