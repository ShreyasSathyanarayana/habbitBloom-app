import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import TimesCompletedIcon from "@/assets/svg/times-completed-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
const _iconSize = horizontalScale(24);

const TimesCompletedHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TimesCompletedIcon width={_iconSize} height={_iconSize} />
      </View>
      <ThemedText
        style={{ fontSize: getFontSize(14), fontFamily: "PoppinsSemiBold" }}
      >
        Times Completed
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
  iconContainer: {
    width: horizontalScale(36),
    height: horizontalScale(36),
    backgroundColor: "rgba(231, 233, 238, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: horizontalScale(8),
  },
});

export default TimesCompletedHeader;
