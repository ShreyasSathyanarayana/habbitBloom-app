import { fetchHabitProgressForCurrentMonth } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { getCurrentMonthAndYear } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import MonthGraph from "./month-graph";
import { horizontalScale, verticalScale } from "@/metric";
import { Skeleton } from "moti/skeleton";

type Props = {
  habitId: string;
};

const ITEM_WIDTH = horizontalScale(35);
const ITEM_HEIGHT = verticalScale(54); // Height for each MonthGraph if needed

const StatisticsMonth = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const listRef = useRef<FlatList>(null);

  const { data: monthData = [], isLoading } = useQuery({
    queryKey: ["current-month-stats", habitId],
    queryFn: () => fetchHabitProgressForCurrentMonth(habitId),
    enabled: !!habitId,
    select: (res) => res?.data ?? [], // directly select data
  });

  const today = useMemo(() => new Date().getDate(), []);

  const todayIndex = useMemo(() => {
    return monthData.findIndex(
      (item) => new Date(item.date).getDate() === today
    );
  }, [monthData, today]);

  useEffect(() => {
    if (listRef.current && todayIndex !== -1) {
      const timeoutId = setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: todayIndex * ITEM_WIDTH,
          animated: true,
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [todayIndex]);

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        <Skeleton width={"30%"} height={verticalScale(25)} />
        <Skeleton width={"100%"} height={ITEM_HEIGHT} />
      </View>
    );
  }

  return (
    <View>
      <ThemedText style={styles.title}>
        {month} {year}
      </ThemedText>
      <FlatList
        ref={listRef}
        data={monthData}
        keyExtractor={(_, index) => `monthly-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialScrollIndex={0}
        renderItem={({ item }) => {
          const date = new Date(item.date).getDate();
          return (
            <MonthGraph
              value={date}
              status={item.status}
              isToday={date === today}
            />
          );
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: getFontSize(17),
    fontFamily: "PoppinsSemiBold",
  },
  list: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
  contentContainer: {
    alignItems: "center",
  },
  skeletonContainer: {
    gap: verticalScale(15),
  },
});

export default StatisticsMonth;
