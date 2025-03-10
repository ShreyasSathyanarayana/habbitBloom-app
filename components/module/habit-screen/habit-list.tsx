import { getHabitsByDate } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HabitCard from "./habit-card";

type HabitListProps = {
  selectedDate: string;
  selectedWeek: number;
};
const HabitList = ({ selectedDate, selectedWeek }: HabitListProps) => {
  const habitDetails = useQuery({
    queryKey: ["habitDetails", selectedDate],
    queryFn: () => getHabitsByDate(selectedDate),
    // staleTime: 0,
  });

  // console.log("Selected Week==>", selectedDate);
  // console.log("Habit Details==>", JSON.stringify(habitDetails.data,null,2));

  return (
    <View>
      <ThemedText
        style={{
          fontFamily: "PoppinsBold",
          paddingVertical: verticalScale(16),
          paddingTop: verticalScale(24),
        }}
      >
        Habits
      </ThemedText>

      <FlatList
        scrollEnabled={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        data={habitDetails.data}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <HabitCard {...item} selectedDate={selectedDate} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default HabitList;
