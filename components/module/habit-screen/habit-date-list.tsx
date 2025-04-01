import { HabitProgressEntry } from "@/api/api";
import { verticalScale } from "@/metric";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import WeekName from "./week-name";
import HabitDateButton from "./habit-date-button";

type Props = {
  habitId: string;
  habitProgress: HabitProgressEntry[];
};

const HabitDateList = memo(({ habitId, habitProgress }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.flatListStyle}>
        {habitProgress.map((item, index) => {
          return (
            <View
              key={"date" + index}
              style={{ alignItems: "center", gap: verticalScale(6) }}
            >
              <WeekName date={item.date} />
              <HabitDateButton
                date={item.date}
                status={item.status}
                habitId={habitId}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
  },
  flatListStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
});

export default HabitDateList;
