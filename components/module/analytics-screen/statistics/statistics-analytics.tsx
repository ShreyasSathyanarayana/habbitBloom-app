import { verticalScale } from "@/metric";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import StreakDetails from "./streak-details";
import Divider from "@/components/ui/divider";
import TimesCompleted from "./times-completed";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import StatisticsMonth from "./statistics-month";
import StatisticsYearly from "./statistics-yearly";

type Props = {
  habitId: string;
};
const _dividerColor = "rgba(38, 50, 56, 0.7)";

const StatisticsAnalytics = ({ habitId }: Props) => {
  return (
    <Animated.View
      key={"statistics-analytics"}
      entering={FadeInRight.springify().damping(40).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(40).stiffness(200)}
      style={{ gap: verticalScale(17), flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ gap: verticalScale(17) }}>
        <Divider style={styles.dividerStyle} />
        <StreakDetails habitId={habitId} />
        <Divider style={styles.dividerStyle} />
        <TimesCompleted habitId={habitId} />
        <Divider style={styles.dividerStyle} />
        <StatisticsMonth habitId={habitId} />
        <Divider style={styles.dividerStyle} />
        <StatisticsYearly habitId={habitId} />
        <Divider style={styles.dividerStyle} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dividerStyle: {
    backgroundColor: _dividerColor,
  },
});

export default StatisticsAnalytics;
