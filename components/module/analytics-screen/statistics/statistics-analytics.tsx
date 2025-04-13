import { verticalScale } from "@/metric";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import StreakDetails from "./streak-details";
import Divider from "@/components/ui/divider";
import TimesCompleted from "./times-completed";
import StatisticsMonth from "./statistics-month";
import StatisticsYearly from "./statistics-yearly";
import StreakChallenge from "./streak-challenge";
import SuccessFailAnalytics from "./success-fail-analytics";

type Props = {
  habitId: string;
  habitHasEndDate: boolean;
};
const _dividerColor = "rgba(38, 50, 56, 0.7)";

const StatisticsAnalytics = ({ habitId, habitHasEndDate = false }: Props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: verticalScale(17), flexGrow: 1 }}
    >
      {/* {habitHasEndDate && (
          <>
            <HabitScore habitId={habitId} />
            <Divider style={styles.dividerStyle} />
          </>
        )} */}
      <StreakDetails habitId={habitId} />
      <Divider style={styles.dividerStyle} />
      <TimesCompleted habitId={habitId} />
      <Divider style={styles.dividerStyle} />
      <StatisticsMonth habitId={habitId} />
      <Divider style={styles.dividerStyle} />
      <StatisticsYearly habitId={habitId} />
      {habitHasEndDate && (
        <>
          <Divider style={styles.dividerStyle} />
          <SuccessFailAnalytics habitId={habitId} />
        </>
      )}
      <Divider style={styles.dividerStyle} />
      <StreakChallenge habitId={habitId} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dividerStyle: {
    backgroundColor: _dividerColor,
  },
});

export default StatisticsAnalytics;
