import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HabitCard from "./habit-card";
import { verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { getAllHabits } from "@/api/api";

const HabitList = () => {
  const gethabitQuery = useQuery({
    queryKey: ["habitList"],
    queryFn: getAllHabits,
  });
  // console.log("habit list", JSON.stringify(gethabitQuery.data, null, 2));

  return (
    <View style={styles.container}>
      <FlatList
        // scrollEnabled={false}
        contentContainerStyle={{
          gap: verticalScale(16),
          paddingBottom: verticalScale(100),
        }}
        data={gethabitQuery.data}
        renderItem={({ item }) => <HabitCard {...item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(16),
  },
});

export default HabitList;
