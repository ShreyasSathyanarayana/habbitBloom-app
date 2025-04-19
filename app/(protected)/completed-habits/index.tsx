import {
  getAllCompletedHabits,
  getAllCompletedHabitsWithStreaks,
} from "@/api/api";
import EmptyCompletedHabits from "@/components/module/completed-habit/empty-completed-habits";
import HabitCompletedCard from "@/components/module/completed-habit/habit-completed-card";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const CompletedHabitScreen = () => {
  const getAllCompletedHabitDetails = useQuery({
    queryKey: ["completed-habit"],
    queryFn: () => {
      return getAllCompletedHabitsWithStreaks();
    },
  });
  // console.log(
  //   "getAllCompletedHabitDetails",
  //   JSON.stringify(getAllCompletedHabitDetails?.data, null, 2)
  // );

  return (
    <Container>
      <Header title="Completed Tasks" />
      <View style={{ flex: 1, padding: verticalScale(16) }}>
        {getAllCompletedHabitDetails?.data?.length == 0 && (
          <EmptyCompletedHabits />
        )}
        {getAllCompletedHabitDetails?.data?.length !== 0 &&
          !getAllCompletedHabitDetails?.isLoading && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={getAllCompletedHabitDetails?.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <HabitCompletedCard {...item} />}
              ItemSeparatorComponent={() => (
                <View style={{ height: verticalScale(16) }} />
              )}
            />
          )}
        {getAllCompletedHabitDetails?.isFetching && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[1, 2, 3, 4]}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => {
              return <Skeleton width={"100%"} height={verticalScale(100)} />;
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: verticalScale(16) }} />
            )}
          />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default CompletedHabitScreen;
