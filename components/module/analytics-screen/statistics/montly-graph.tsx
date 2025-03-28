import { fetchMonthlyHabitProgressForYear } from "@/api/api";
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

const MontlyGraph = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const getMonthlyGraphQuery = useQuery({
    queryKey: ["monthly", habitId],
    queryFn: () => fetchMonthlyHabitProgressForYear(habitId),
  });
  //   console.log("monthly", JSON.stringify(getMonthlyGraphQuery.data, null, 2));

  return (
    <View
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
        data={getMonthlyGraphQuery?.data}
        keyExtractor={(_, index) => index.toString() + "weekDetails"}
        renderItem={({ item, index }) => {
          return (
            <YearGraph
              date={item.month}
              completed={item.completed}
              total={30}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default MontlyGraph;
