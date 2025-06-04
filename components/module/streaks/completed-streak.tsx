import { getHighestCompletedHabitList } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import LeaderBoard from "./leader-board";
import StreakCard from "./ui/streak-card";
import { Divider } from "@rneui/base";
import { horizontalScale, verticalScale } from "@/metric";
import { useFocusEffect } from "expo-router";
import ServerError from "../errors/server-error";
import { getFontSize } from "@/font";
import { useAuth } from "@/context/AuthProvider";
import NoInternet from "../errors/no-internet";

const CompletedStreak = () => {
  const getCompletedStreakQuery = useQuery({
    queryKey: ["getCompletedStreak"],
    queryFn: () => getHighestCompletedHabitList(),
  });
  const { isConnected } = useAuth();

  useFocusEffect(
    useCallback(() => {
      getCompletedStreakQuery?.refetch();
    }, [getCompletedStreakQuery?.refetch])
  );

  // console.log(
  //   "getUserStreakQuery",
  //   JSON.stringify(getCompletedStreakQuery.data, null, 2)
  // );

  if (!isConnected) {
    return <NoInternet onRefresh={() => getCompletedStreakQuery?.refetch()} />;
  }

  if (getCompletedStreakQuery?.status === "error") {
    return <ServerError onRefresh={() => getCompletedStreakQuery?.refetch()} />;
  }

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
          <>
            <IndicationText />
            <LeaderBoard userDetails={data} cardType="completed" />
          </>
        }
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  indicationScreen: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: "rgba(138, 43, 226, 0.38)",
    borderWidth: horizontalScale(1),
    borderColor: "rgba(138, 43, 226, 1)",
    borderRadius: horizontalScale(16),
  },
});

export default CompletedStreak;

const IndicationText = () => {
  return (
    <View style={styles.indicationScreen}>
      <ThemedText style={{ fontSize: getFontSize(14), textAlign: "center" }}>
        Shows total days users completed their tasks.
      </ThemedText>
    </View>
  );
};
