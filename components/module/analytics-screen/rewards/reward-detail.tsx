import React, { useCallback } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import RewardDetailContainer from "./reward-detail-container";
import { Reward } from "@/api/api";
import RewardIconContainer from "./reward-icon-container";
import DayInfo from "./day-info";
import { SheetManager } from "react-native-actions-sheet";

const RewardDetail = ({
  created_at,
  day,
  id,
  reward_image_url,
  highest_streak,
  habitName,
}: Reward & { highest_streak: number; habitName: string }) => {
  const handleRewardPress = () => {
    if (day > highest_streak) return; // Only show rewards for completed days
    SheetManager.show("reward-sheet", {
      payload: { rewardUri: reward_image_url, habitName: habitName },
    });
  };

  return (
    <TouchableOpacity
      disabled={day > highest_streak}
      onPress={handleRewardPress}
    >
      <RewardDetailContainer>
        <RewardIconContainer
          imageUri={reward_image_url}
          disable={day > highest_streak}
        />
        <DayInfo day={day} />
      </RewardDetailContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default RewardDetail;
