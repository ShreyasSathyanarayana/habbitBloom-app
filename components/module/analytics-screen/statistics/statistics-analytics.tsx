import { verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import StreakDetails from "./streak-details";
import Divider from "@/components/ui/divider";
import TimesCompleted from "./times-completed";

type Props = {
  habitId: string;
};
const _dividerColor = "rgba(38, 50, 56, 0.7)";

const StatisticsAnalytics = ({ habitId }: Props) => {
  return (
    <View style={{ gap: verticalScale(17) }}>
      <Divider style={styles.dividerStyle} />
      <StreakDetails habitId={habitId} />
      <Divider style={styles.dividerStyle} />
      <TimesCompleted habitId={habitId} />
      <Divider style={styles.dividerStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  dividerStyle: {
    backgroundColor: _dividerColor,
  },
});

export default StatisticsAnalytics;
