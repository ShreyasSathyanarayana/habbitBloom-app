import { TopCompletedUser, TopStreakUser } from "@/api/api";
import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import LeaderBoardIcon from "@/assets/svg/leader-board1.svg";
import { horizontalScale, verticalScale } from "@/metric";
import Avatar from "./ui/avatar";
import { ThemedText } from "@/components/ui/theme-text";
import { router } from "expo-router";
type LeaderBoardProps = {
  userDetails: TopStreakUser[] | TopCompletedUser[];
  cardType: "current" | "completed";
};
const { width } = Dimensions.get("window");
const _AVATAR_CONTAINER_SIZE = (width - horizontalScale(32)) / 3;
const _SECOND_AVATAR_SIZE = horizontalScale(70);
const _FIRST_AVATAR_SIZE = horizontalScale(100);
const _THIRD_AVATAR_SIZE = horizontalScale(70);
const _SECOND_TRANSLATE_Y = verticalScale(50);
const _THIRD_TRANSLATE_Y = verticalScale(70);

const LeaderBoard = ({ userDetails, cardType }: LeaderBoardProps) => {
  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(protected)/other-user-view",
              params: { userId: userDetails?.[1]?.user_id },
            })
          }
          style={[
            styles.avatarContainer,
            { transform: [{ translateY: _SECOND_TRANSLATE_Y }] },
          ]}
        >
          <Avatar
            badgeEnabled={false}
            style={{ width: _SECOND_AVATAR_SIZE, height: _SECOND_AVATAR_SIZE }}
            uri={userDetails?.[1]?.profile_pic}
            rank={userDetails?.[1]?.rank}
          />
          <ThemedText style={styles.userNameStyle}>
            {userDetails?.[1]?.full_name}
          </ThemedText>
          <ThemedText style={styles.streakStyle}>
            {cardType === "current" &&
              userDetails?.[1]?.current_streak + " Days ⏳"}
            {cardType === "completed" &&
              userDetails?.[1]?.total_completions + " Days 🎯"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(protected)/other-user-view",
              params: { userId: userDetails?.[0]?.user_id },
            })
          }
          style={styles.avatarContainer}
        >
          <Avatar
            badgeEnabled={false}
            style={{ width: _FIRST_AVATAR_SIZE, height: _FIRST_AVATAR_SIZE }}
            uri={userDetails?.[0]?.profile_pic}
            rank={userDetails?.[0]?.rank}
          />
          <ThemedText style={styles.userNameStyle}>
            {userDetails?.[0]?.full_name}
          </ThemedText>
          <ThemedText style={styles.streakStyle}>
            {cardType === "current" &&
              userDetails?.[0]?.current_streak + " Days ⏳"}
            {cardType === "completed" &&
              userDetails?.[0]?.total_completions + " Days 🎯"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(protected)/other-user-view",
              params: { userId: userDetails?.[2]?.user_id },
            })
          }
          style={[
            styles.avatarContainer,
            { transform: [{ translateY: _THIRD_TRANSLATE_Y }] },
          ]}
        >
          <Avatar
            badgeEnabled={false}
            style={{ width: _THIRD_AVATAR_SIZE, height: _THIRD_AVATAR_SIZE }}
            uri={userDetails?.[2]?.profile_pic}
            rank={userDetails?.[2]?.rank}
          />
          <ThemedText style={styles.userNameStyle}>
            {userDetails?.[2]?.full_name}
          </ThemedText>
          <ThemedText style={styles.streakStyle}>
            {cardType === "current" &&
              userDetails?.[2]?.current_streak + " Days ⏳"}
            {cardType === "completed" &&
              userDetails?.[2]?.total_completions + " Days 🎯"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <LeaderBoardIcon width={horizontalScale(349)} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: verticalScale(10),
  },
  avatarContainer: {
    width: _AVATAR_CONTAINER_SIZE,
    // height: _AVATAR_CONTAINER_SIZE,
    // borderRadius: _AVATAR_CONTAINER_SIZE / 2,
    alignItems: "center",
    gap: verticalScale(5),
    paddingTop: verticalScale(8),
  },
  userNameStyle: {
    fontSize: horizontalScale(14),
  },
  streakStyle: {
    fontSize: horizontalScale(12),
    borderWidth: horizontalScale(0.5),
    // borderColor: "white",
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(4),
    textAlign: "center",
  },
});

export default LeaderBoard;
