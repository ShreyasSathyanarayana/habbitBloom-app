import { horizontalScale, verticalScale } from "@/metric";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";
const _spacing = 8;
const HabitListShimmer = () => {
  return (
    <View
      style={{
        paddingHorizontal: horizontalScale(16),
        marginTop: verticalScale(24),
        gap: verticalScale(24),
      }}
    >
      <Skeleton width={"30%"} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(8),
          justifyContent: "space-between",
        }}
      >
        <Skeleton width={horizontalScale(150)} height={verticalScale(150)} />
        <Skeleton width={horizontalScale(150)} height={verticalScale(150)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HabitListShimmer;
