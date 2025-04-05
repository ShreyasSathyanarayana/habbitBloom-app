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
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
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

  if (getWeeklyQuery?.isLoading) {
    return <Skeleton width={"100%"} height={verticalScale(54)} />;
  }

  return (
    <View
      key={"weekly-graph"}
      style={{
        paddingVertical: verticalScale(16),
        justifyContent: "space-between",
        flex: 1,
      }}
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
            <YearGraph
              date={item.week}
              completed={item.completed}
              total={7}
              lastIndex={
                index === (getWeeklyQuery?.data?.length ?? 0) - 1 ? true : false
              }
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default WeeklyGraph;
