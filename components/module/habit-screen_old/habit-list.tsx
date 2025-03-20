import { getHabitsByDate } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HabitCard from "./habit-card";
import HabitListShimmer from "./habit-list-shimmer";

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

  if (habitDetails.isLoading) {
    return <HabitListShimmer />;
  }

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
          flex: 1,
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
