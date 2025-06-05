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
  habitName: string;
  otherUser?: boolean; // Optional prop for other user view
};

const StreakChallenge = ({ habitId, habitName,otherUser }: Props) => {
  const { data: streakChallenges, isLoading: isStreakLoading } = useQuery({
    queryKey: ["streakChallenge", habitId],
    queryFn: getStreakChallengeDetails,
  });

  const { data: habitStats } = useQuery({
    queryKey: ["habit-stats", habitId],
    queryFn: () => getHabitStats(habitId),
    enabled: !!habitId,
  });

  const highestStreak = habitStats?.highestStreak ?? 0;

  if (isStreakLoading || !streakChallenges?.length) {
    return null; // Optional: You can replace with a Loader if needed
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StreakChallengeIcon />
        <ThemedText style={styles.titleText}>Streak Challenge</ThemedText>
      </View>

      <FlatList
        data={streakChallenges}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => (
          <View style={{ width: horizontalScale(16) }} />
        )}
        renderItem={({ item }) => (
          <RewardDetail
            habitName={habitName}
            {...item}
            highest_streak={highestStreak}
            otherUser={otherUser} // Pass the otherUser prop to RewardDetail
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  titleText: {
    fontSize: getFontSize(12),
  },
  flatListContent: {
    paddingHorizontal: horizontalScale(8),
  },
});

export default StreakChallenge;
