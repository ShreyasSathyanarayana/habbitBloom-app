import { fetchLast7DaysHabitProgress } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, SectionList, StyleSheet, View } from "react-native";
import WeekName from "./week-name";
import HabitDateButton from "./habit-date-button";
import { Skeleton } from "moti/skeleton";

type Props = {
  habitId: string;
};

const HabitDateList = ({ habitId }: Props) => {
  const getHabitDatesQuery = useQuery({
    queryKey: ["habitDates", habitId],
    queryFn: () => {
      return fetchLast7DaysHabitProgress(habitId ?? "");
    },
    enabled: !!habitId,
    staleTime: 5000,
    
  });
  // console.log("habit dates", JSON.stringify(getHabitDatesQuery.data, null, 2));
  if (getHabitDatesQuery?.isLoading) {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          contentContainerStyle={styles.flatListStyle}
          data={[1, 2, 3, 4, 5, 6, 7]}
          keyExtractor={(_, index) => index.toString() + "dateListkey"}
          renderItem={({ item }) => {
            return (
              <Skeleton
                width={horizontalScale(32)}
                height={horizontalScale(50)}
              />
            );
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        horizontal
        initialNumToRender={7}
        contentContainerStyle={styles.flatListStyle}
        data={getHabitDatesQuery.data?.data}
        renderItem={({ item }) => {
          return (
            <View style={{ alignItems: "center", gap: verticalScale(6) }}>
              <WeekName date={item.date} />
              <HabitDateButton
                date={item.date}
                status={item.status}
                habitId={habitId}
              />
            </View>
          );
        }}
      />
      {/* <View style={styles.flatListStyle}>
        {getHabitDatesQuery.data?.data.map((item, index) => {
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
      </View> */}
    </View>
  );
};

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
