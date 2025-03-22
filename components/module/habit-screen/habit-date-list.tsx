import { fetchLast7DaysHabitProgress } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import WeekName from "./week-name";
import HabitDateButton from "./habit-date-button";

type Props = {
  habitId: string;
};

const HabitDateList = ({ habitId }: Props) => {
  const getHabitDatesQuery = useQuery({
    queryKey: ["habitDates", habitId],
    queryFn: () => {
      return fetchLast7DaysHabitProgress(habitId ?? "");
    },
  });
  // console.log("habit dates", JSON.stringify(getHabitDatesQuery.data, null, 2));

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
        data={getHabitDatesQuery.data?.data}
        renderItem={({ item }) => {
          return (
            <View style={{ alignItems: "center", gap: verticalScale(6) }}>
              <WeekName date={item.date} />
              <HabitDateButton date={item.date} status={item.status} habitId={habitId} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
  },
});

export default HabitDateList;
