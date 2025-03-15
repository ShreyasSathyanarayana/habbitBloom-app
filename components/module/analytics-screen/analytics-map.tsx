import { ThemedText } from "@/components/ui/theme-text";
import { verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import WeekMap from "./week-map";
import MonthMap from "./month-map";
import YearMap from "./year-map";
type Props = {
  selectedMenu: string;
  habitId: string;
};

const AnalyticsMap = ({ selectedMenu, habitId }: Props) => {
  return (
    <View style={styles.container}>
      {selectedMenu === "Weekly" && (
        <ThemedText style={{ fontFamily: "PoppinsMedium" }}>
          Week Heatmap
        </ThemedText>
      )}
      {selectedMenu === "Weekly" && <WeekMap habitId={habitId} />}
      {selectedMenu === "Monthly" && <MonthMap habitId={habitId} />}
      {selectedMenu === "Year" && <YearMap habitId={habitId} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(24),
  },
});

export default AnalyticsMap;
