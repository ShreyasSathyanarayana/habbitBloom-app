import { getHighestCompletedHabitList, getUserStreaks } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Streaks = () => {
  const getUserStreakQuery = useQuery({
    queryKey: ["getUserStreak"],
    queryFn: () => getUserStreaks(),
  });

  const getCompletedStreakQuery = useQuery({
    queryKey: ["getCompletedStreak"],
    queryFn:()=>getHighestCompletedHabitList()
  })

  console.log(
    "getUserStreakQuery",
    JSON.stringify(getUserStreakQuery.data, null, 2)
  );

  // console.log(
  //   "getCompletedStreakQuery",
  //   JSON.stringify(getCompletedStreakQuery.data, null, 2)
  // );
  

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ThemedText>streaks</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Streaks;
