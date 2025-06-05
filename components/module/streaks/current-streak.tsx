import { getUserStreaks } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { horizontalScale, verticalScale } from "@/metric";
import LeaderBoard from "./leader-board";
import StreakCard from "./ui/streak-card";
import { useFocusEffect } from "expo-router";
import { Divider } from "@rneui/base";
import ServerError from "../errors/server-error";
import { useAuth } from "@/context/AuthProvider";
import NoInternet from "../errors/no-internet";

const CurrentStreak = () => {
  const getUserStreakQuery = useQuery({
    queryKey: ["getUserStreak"],
    queryFn: () => getUserStreaks(),
    refetchOnWindowFocus: "always",
  });
  const { isConnected } = useAuth();

  useFocusEffect(
    useCallback(() => {
      getUserStreakQuery?.refetch();
    }, [getUserStreakQuery?.refetch])
  );

  // console.log(
  //   "getUserStreakQuery",
  //   JSON.stringify(getUserStreakQuery.data?.slice(3), null, 2)
  // );

  if (!isConnected) {
    return <NoInternet onRefresh={() => getUserStreakQuery?.refetch()} />;
  }

  if (getUserStreakQuery?.status == "error") {
    return <ServerError onRefresh={() => getUserStreakQuery?.refetch()} />;
  }
  if (getUserStreakQuery?.isLoading) {
    return null;
  }
  if (getUserStreakQuery?.data?.length === 0) {
    return null;
  }
  const data = getUserStreakQuery.data ?? [];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.user_id}
        ItemSeparatorComponent={() => (
          <Divider color="rgba(255, 255, 255, 0.4)" />
        )}
        renderItem={({ item }) => (
          <StreakCard userDetails={item} cardType="current" />
        )}
        ListHeaderComponent={
          <LeaderBoard userDetails={data} cardType="current" />
        }
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CurrentStreak;
