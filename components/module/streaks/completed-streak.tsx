import { getHighestCompletedHabitList } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import LeaderBoard from "./leader-board";
import StreakCard from "./ui/streak-card";
import { Divider } from "@rneui/base";
import { verticalScale } from "@/metric";
import { useFocusEffect } from "expo-router";

const CompletedStreak = () => {
  const getCompletedStreakQuery = useQuery({
    queryKey: ["getCompletedStreak"],
    queryFn: () => getHighestCompletedHabitList(),
  });

  useFocusEffect(
    useCallback(() => {
      getCompletedStreakQuery?.refetch();
    }, [getCompletedStreakQuery?.refetch])
  );

  // console.log(
  //   "getUserStreakQuery",
  //   JSON.stringify(getCompletedStreakQuery.data, null, 2)
  // );

  if (getCompletedStreakQuery?.isLoading) {
    return null;
  }
  if (getCompletedStreakQuery?.data?.length === 0) {
    return null;
  }

  const data = getCompletedStreakQuery.data ?? [];

  return (
    <View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.user_id}
        ItemSeparatorComponent={() => (
          <Divider color="rgba(255, 255, 255, 0.4)" />
        )}
        renderItem={({ item }) => (
          <StreakCard userDetails={item} cardType="completed" />
        )}
        ListHeaderComponent={
          <LeaderBoard userDetails={data} cardType="completed" />
        }
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CompletedStreak;
