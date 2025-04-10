import { fetchHabitProgressForCurrentMonth } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { getCurrentMonthAndYear } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import MonthGraph from "./month-graph";
import { horizontalScale, verticalScale } from "@/metric";
import { Skeleton } from "moti/skeleton";

type Props = {
  habitId: string;
};

const ITEM_WIDTH = horizontalScale(26);

const StatisticsMonth = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const listRef = useRef<FlatList>(null);

  const getCurrentMonthStatsQuery = useQuery({
    queryKey: ["current-month-stats", habitId],
    queryFn: () => fetchHabitProgressForCurrentMonth(habitId),
    enabled: !!habitId,
  });

  // Find today's index in the list
  const today = new Date().getDate();
  const data = getCurrentMonthStatsQuery?.data?.data ?? [];
  const todayIndex = data.findIndex(
    (item) => new Date(item.date).getDate() === today
  );

  useEffect(() => {
    if (listRef.current && todayIndex !== -1 && data) {
      const timeoutId = setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: todayIndex * ITEM_WIDTH,
          animated: true,
        });
      }, 1000);

      return () => clearTimeout(timeoutId); // Cleanup to avoid memory leaks
    }
  }, [todayIndex, data]);

  if (getCurrentMonthStatsQuery?.isLoading) {
    return (
      <View style={{ gap: verticalScale(15) }}>
        <Skeleton width={"30%"} height={verticalScale(25)} />
        <Skeleton width={"100%"} height={verticalScale(54)} />
      </View>
    );
  }

  return (
    <View>
      <ThemedText
        style={{ fontSize: getFontSize(17), fontFamily: "PoppinsSemiBold" }}
      >
        {month} {year}
      </ThemedText>
      <FlatList
        ref={listRef}
        showsHorizontalScrollIndicator={false}
        style={{
          marginTop: verticalScale(15),
          marginBottom: verticalScale(15),
        }}
        horizontal
        keyExtractor={(item, index) => index.toString() + "Montly"}
        data={data}
        initialScrollIndex={0} // Start from today
        getItemLayout={(data, index) => ({
          length: 50, // Adjust based on item size
          offset: 50 * index,
          index,
        })}
        renderItem={({ item }) => {
          const date = new Date(item.date).getDate();
          const todayDate = new Date().getDate();
          return (
            <MonthGraph
              value={date}
              status={item.status}
              isToday={date === todayDate}
            />
          );
        }}
        scrollEventThrottle={16}
        // pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default StatisticsMonth;
