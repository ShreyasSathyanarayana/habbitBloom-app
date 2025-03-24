import { fetchWeeklyHabitProgressForYear } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { verticalScale } from "@/metric";
import { getCurrentMonthAndYear } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import YearGraph from "./year-graph";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
type Props = {
  habitId: string;
};

const WeeklyGraph = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const getWeeklyQuery = useQuery({
    queryKey: ["weekly", habitId],
    queryFn: () => {
      return fetchWeeklyHabitProgressForYear(habitId);
    },
    enabled: !!habitId,
  });
  // console.log("weekly", JSON.stringify(getWeeklyQuery.data, null, 2));

  return (
    <Animated.View
      key={"weekly-graph"}
      entering={FadeInRight.springify().damping(40).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(40).stiffness(200)}
      style={{ paddingVertical: verticalScale(16) }}
    >
      <ThemedText
        style={{ fontSize: getFontSize(17), fontFamily: "PoppinsSemiBold" }}
      >
        {month} {year}
      </ThemedText>
      <FlatList
        horizontal
        contentContainerStyle={{
          paddingTop: verticalScale(16),
        }}
        scrollEventThrottle={16}
        data={getWeeklyQuery.data}
        keyExtractor={(_, index) => index.toString() + "weekDetails"}
        renderItem={({ item, index }) => {
          return (
            <YearGraph date={item.week} completed={item.completed} total={7} />
          );
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({});

export default WeeklyGraph;
