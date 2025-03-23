import React from "react";
import { StyleSheet, View } from "react-native";
import StreaksIcon from "@/assets/svg/streak-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
type Props = {
  habitId: string;
};
const _iconSize = horizontalScale(24);
const CurrentStreak = ({ habitId }: Props) => {
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
      <ThemedText style={{ fontSize: getFontSize(14) }}>
        <ThemedText style={{ fontSize: getFontSize(24) }}>4</ThemedText>  Days
      </ThemedText>
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
