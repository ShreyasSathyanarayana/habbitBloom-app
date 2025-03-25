import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import CurrentStreak from "./current-streak";
import MonthMap from "./month-map";
import { verticalScale } from "@/metric";
import { LayoutAnimationConfig } from "react-native-reanimated";
type Props = {
  habitId: string;
};

const CalenderAnalytics = ({ habitId }: Props) => {
  return (
    <LayoutAnimationConfig skipEntering>
      <View style={{ gap: verticalScale(24) }}>
        <CurrentStreak habitId={habitId} />
        <MonthMap habitId={habitId} />
      </View>
    </LayoutAnimationConfig>
  );
};

const styles = StyleSheet.create({});

export default CalenderAnalytics;
