import { getAllCompletedHabits } from "@/api/api";
import EmptyCompletedHabits from "@/components/module/completed-habit/empty-completed-habits";
import HabitCompletedCard from "@/components/module/completed-habit/habit-completed-card";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { horizontalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const CompletedHabitScreen = () => {
  const getAllCompletedHabitDetails = useQuery({
    queryKey: ["completed-habit"],
    queryFn: () => {
      return getAllCompletedHabits();
    },
  });
  // console.log(
  //   "getAllCompletedHabitDetails",
  //   JSON.stringify(getAllCompletedHabitDetails?.data, null, 2)
  // );

  return (
    <Container>
      <Header title="Completed Tasks" />
      {getAllCompletedHabitDetails?.data?.length == 0 && (
        <EmptyCompletedHabits />
      )}
      {getAllCompletedHabitDetails?.data?.length !== 0 && (
        <FlatList
          data={getAllCompletedHabitDetails?.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HabitCompletedCard {...item} />}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({});

export default CompletedHabitScreen;
