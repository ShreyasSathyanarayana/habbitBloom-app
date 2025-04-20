import { CompletedHabits, CompletedHabitWithStreak } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import HabitCardHead from "../habit-screen/habit-card-head";
import HabitCardFooter from "../habit-screen/habit-card-footer";
import { SheetManager } from "react-native-actions-sheet";
import CompletedBadgeIcon from "@/assets/svg/completed-badge.svg";
import CompletedTagIcon from "@/assets/svg/completed-tag.svg";

const _iconSize = horizontalScale(150);

const HabitCompletedCard = (props: CompletedHabitWithStreak) => {
  const onPressThreeDot = () => {
    SheetManager.show("habit-details", {
      payload: { data: props, isHabitCompleted: true },
    });
  };
  return (
    <Pressable style={{ flex: 1 }}>
      <LinearGradient
        colors={["#2B0053", "#000000"]}
        start={{ x: 0.0147, y: 0.111 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* <CompletedTagIcon
          style={styles.tagStyles}
          width={_iconSize}
          height={_iconSize}
        /> */}
        <HabitCardHead
          habitName={props.habit_name}
          category={props.category}
          completed={true}
          rewardUri={props.rewardImageUrl}
        />

        <HabitCardFooter
          isHabitPublic={props.public}
          habitId={props.id}
          onPressThreeDot={onPressThreeDot}
        />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: horizontalScale(16),
    borderWidth: horizontalScale(2),
    borderRadius: horizontalScale(16),
    borderColor: "rgba(138, 43, 226, 1)",
    gap: verticalScale(16),
    flex: 1,
  },
  tagStyles: {
    position: "absolute",
    right: horizontalScale(-40),
    zIndex: 2,
    top: -3,
  },
});

export default HabitCompletedCard;
