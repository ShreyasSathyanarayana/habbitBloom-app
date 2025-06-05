import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Avatar from "./avatar";
import {
  getNearestRewardBadge,
  TopCompletedUser,
  TopStreakUser,
} from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import RewardIcon from "../../analytics-screen/rewards/reward-icon";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { getUserLabelById } from "@/utils/constants";

type StreakCardProps = {
  userDetails: TopStreakUser | TopCompletedUser;
  cardType: "current" | "completed";
};

const StreakCard = ({ userDetails, cardType }: StreakCardProps) => {
  const getBadgeQuery = useQuery({
    queryKey: ["getBadge", userDetails?.best_streak],
    queryFn: () => getNearestRewardBadge(userDetails?.best_streak),
    enabled: !!userDetails?.best_streak,
  });
  // console.log("getBadgeQuery", getBadgeQuery.data?.reward_image_url);

  const onPress = () => {
    // console.log("User Details Pressed", JSON.stringify(userDetails, null, 2));
    router.push({
      pathname: "/(protected)/other-user-view",
      params: { userId: userDetails?.user_id },
    });
  };


  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Avatar
          key={userDetails?.user_id}
          uri={userDetails?.profile_pic}
          rank={userDetails?.rank}
          badgeStyle={{ left: horizontalScale(-5), top: horizontalScale(-6) }}
        />
        <View style={{ gap: verticalScale(8) }}>
          <ThemedText numberOfLines={1} style={styles.userNameStyle}>
            {getUserLabelById(userDetails?.user_id, userDetails?.full_name)}
          </ThemedText>
          <ThemedText numberOfLines={1} style={styles.streakStyle}>
            {cardType === "current" && userDetails?.current_streak + " Days ⏳"}
            {cardType === "completed" &&
              userDetails?.total_completions + " Days 🎯"}
          </ThemedText>
        </View>
      </View>
      <RewardIcon
        imageUri={getBadgeQuery.data?.reward_image_url}
        style={{ right: horizontalScale(8) }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(12),
    padding: horizontalScale(8),
  },
  userNameStyle: {
    fontSize: getFontSize(14),
    width: horizontalScale(180),
    // backgroundColor: "red",
  },
  streakStyle: {
    fontSize: getFontSize(12),
    fontFamily: "PoppinsSemiBold",
  },
});

export default StreakCard;
