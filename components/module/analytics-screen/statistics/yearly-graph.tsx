import {
  fetchYearlyHabitProgressForLastFiveYears,
  fetchYearlyHabitProgressForLastThreeYears,
} from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { verticalScale } from "@/metric";
import { getCurrentMonthAndYear } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import YearGraph from "./year-graph";
type Props = {
  habitId: string;
};

const YearlyGraph = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const getYearlyGraphQuery = useQuery({
    queryKey: ["yearly", habitId],
    queryFn: () => fetchYearlyHabitProgressForLastFiveYears(habitId),
    enabled: !!habitId,
  });
  return (
    <Animated.View
      key={"yearly-graph"}
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
        data={getYearlyGraphQuery.data}
        keyExtractor={(_, index) => index.toString() + "weekDetails"}
        renderItem={({ item, index }) => {
          return (
            <YearGraph
              date={item.year}
              completed={item.completed}
              total={365}
            />
          );
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({});

export default YearlyGraph;
