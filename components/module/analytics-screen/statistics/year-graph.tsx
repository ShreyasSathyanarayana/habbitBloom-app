import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
const _width = horizontalScale(65);
const _iconSize = horizontalScale(16);
type Props = {
  date: string | number;
  completed: number;
  total: number;
  lastIndex?: boolean;
};

const YearGraph = ({ date, completed, total, lastIndex = false }: Props) => {
  return (
    <View
      style={{
        alignItems: "center",
        gap: verticalScale(6),
        width: _width,
        // height: verticalScale(100),
        justifyContent: "flex-end",
        // height: verticalScale(123),
      }}
    >
      <ThemedText
        style={{ fontSize: getFontSize(12), fontFamily: "PoppinsSemiBold" }}
      >
        {completed}
      </ThemedText>
      <View style={{ width: "auto" }}>
        <View
          style={[
            styles.circle,
            completed != 0 && {
              height: horizontalScale((total / (total + 1 - completed)) * 20),
            },
          ]}
        />
        {!lastIndex && <View style={styles.horizontalLine} />}
      </View>
      <ThemedText
        style={[{ fontSize: getFontSize(14), fontFamily: "PoppinsMedium" }]}
      >
        {date}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: horizontalScale(6),
    height: horizontalScale(6),
    backgroundColor: "rgba(138, 43, 226, 1)",
    borderRadius: horizontalScale(10),
  },
  horizontalLine: {
    width: _width,
    // flexGrow: 1,
    height: horizontalScale(2),
    backgroundColor: "rgba(138, 43, 226, 0.3)",
    position: "absolute",
    zIndex: -1,
    bottom: horizontalScale(2),
  },
});

export default YearGraph;
