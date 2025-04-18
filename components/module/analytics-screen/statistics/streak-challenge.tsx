import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import StreakChallengeIcon from "@/assets/svg/streak-awards-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { getHabitStats, getStreakChallengeDetails } from "@/api/api";
import RewardDetail from "../rewards/reward-detail";
type Props = {
  habitId: string;
};

const StreakChallenge = ({ habitId }: Props) => {
  const getStreakChallengeQuery = useQuery({
    queryKey: ["streakChallenge"],
    queryFn: () => {
      return getStreakChallengeDetails();
    },
  });
  // console.log(
  //   "Streak Challenge",
  //   JSON.stringify(getStreakChallengeQuery.data, null, 2)
  // );
  const getHabitStatsQuery = useQuery({
    queryKey: ["habit-stats", habitId],
    queryFn: () => {
      return getHabitStats(habitId);
    },
    enabled: !!habitId,
  });

  // console.log("habit stats", JSON.stringify(getHabitStatsQuery.data, null, 2));

  return (
    <View style={{ gap: verticalScale(16) }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <StreakChallengeIcon />
        <ThemedText style={{ fontSize: getFontSize(12) }}>
          Streak Challenge
        </ThemedText>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: horizontalScale(16),
        }}
        data={getStreakChallengeQuery?.data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <RewardDetail
              {...item}
              highest_streak={getHabitStatsQuery?.data?.highestStreak ?? 0}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  awardContainer: {
    width: horizontalScale(60),
    height: horizontalScale(60),
    borderRadius: horizontalScale(8),
    backgroundColor: "white",
  },
});

export default StreakChallenge;
