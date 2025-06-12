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
  otherUser,
  habitId,
}: Reward & {
  highest_streak: number;
  habitName: string;
  otherUser?: boolean;
  habitId: string;
}) => {
  const handleRewardPress = () => {
    if (otherUser) return;
    if (day > highest_streak) return; // Only show rewards for completed days
    SheetManager.show("reward-sheet", {
      payload: {
        rewardUri: reward_image_url,
        habitName: habitName,
        habitId: habitId,
      },
    });
  };
  // console.log("RewardDetail Rendered", otherUser);

  return (
    <TouchableOpacity
      disabled={day > highest_streak || otherUser}
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
