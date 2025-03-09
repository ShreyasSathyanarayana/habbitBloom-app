import { getHabitsByFrequency } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HabitCard from "./habit-card";

type HabitListProps = {
  selectedWeek: number;
};
const HabitList = ({ selectedWeek }: HabitListProps) => {
  const habitDetails = useQuery({
    queryKey: ["habitDetails", selectedWeek], // Add selectedWeek to the key
    queryFn: () => getHabitsByFrequency(selectedWeek), // Pass function reference
  });

  // console.log("Selected Week==>", selectedWeek);

  console.log("habitDetails", JSON.stringify(habitDetails.data, null, 2));

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
          return <HabitCard {...item} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default HabitList;
