import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CurrentStreak from "./current-streak";
import MonthMap from "./month-map";
import { verticalScale } from "@/metric";
import { LayoutAnimationConfig } from "react-native-reanimated";
import HabitDescription from "./habit-description";
type Props = {
  habitId: string;
};

const CalenderAnalytics = ({ habitId }: Props) => {
  return (
    <LayoutAnimationConfig skipEntering>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: verticalScale(24) }}
      >
        <CurrentStreak habitId={habitId} />
        <MonthMap habitId={habitId} />
        <HabitDescription habitId={habitId} />
      </ScrollView>
    </LayoutAnimationConfig>
  );
};

const styles = StyleSheet.create({});

export default CalenderAnalytics;
