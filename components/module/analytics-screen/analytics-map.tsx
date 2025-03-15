import { ThemedText } from "@/components/ui/theme-text";
import { verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import WeekMap from "./week-map";
type Props = {
  selectedMenu: string;
  habitId: string;
};

const AnalyticsMap = ({ selectedMenu, habitId }: Props) => {
  return (
    <View style={styles.container}>
      <ThemedText style={{ fontFamily: "PoppinsMedium" }}>
        {selectedMenu === "Weekly" && "Week Heatmap"}
      </ThemedText>
      {selectedMenu === "Weekly" && <WeekMap habitId={habitId} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(24),
  },
});

export default AnalyticsMap;
