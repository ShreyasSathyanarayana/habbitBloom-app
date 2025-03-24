import React from "react";
import { StyleSheet, View } from "react-native";
import CompletedIcon from "@/assets/svg/completed-icon copy.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
const _width = horizontalScale(45);
const _iconSize = horizontalScale(16);
type Props = {
  value: string | number;
  status: boolean | null;
  isToday: boolean;
};

const MonthGraph = ({ status, value, isToday }: Props) => {
  return (
    <View
      style={{
        alignItems: "center",
        gap: verticalScale(6),
        width: _width,
      }}
    >
      <View style={{ width: _iconSize, height: _iconSize }}>
        {status === true && (
          <CompletedIcon width={_iconSize} height={_iconSize} />
        )}
      </View>
      <View style={{ width: "auto" }}>
        <View style={styles.circle} />
        <View style={styles.horizontalLine} />
      </View>
      <ThemedText
        style={[
          { fontSize: getFontSize(14), fontFamily: "PoppinsMedium" },
          isToday && { color: "rgba(138, 43, 226, 1)" },
        ]}
      >
        {value}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: horizontalScale(6),
    height: horizontalScale(6),
    backgroundColor: "rgba(138, 43, 226, 1)",
    borderRadius: horizontalScale(6),
  },
  horizontalLine: {
    width: _width,
    // flexGrow: 1,
    height: horizontalScale(2),
    backgroundColor: "rgba(138, 43, 226, 0.3)",
    position: "absolute",
    zIndex: -1,
    top: horizontalScale(2),
  },
});

export default MonthGraph;
