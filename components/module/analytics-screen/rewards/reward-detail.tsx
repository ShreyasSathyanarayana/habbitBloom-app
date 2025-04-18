import React from "react";
import { StyleSheet, View } from "react-native";
import RewardDetailContainer from "./reward-detail-container";
import { Reward } from "@/api/api";
import RewardIconContainer from "./reward-icon-container";
import DayInfo from "./day-info";

const RewardDetail = ({
  created_at,
  day,
  id,
  reward_image_url,
  highest_streak,
}: Reward & { highest_streak: number }) => {
  return (
    <RewardDetailContainer>
      <RewardIconContainer
        imageUri={reward_image_url}
        disable={day > highest_streak}
      />
      <DayInfo day={day} />
    </RewardDetailContainer>
  );
};

const styles = StyleSheet.create({});

export default RewardDetail;
