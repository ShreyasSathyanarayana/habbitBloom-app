import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import HabitCardHead from "./habit-card-head";
import HabitFrequencyList from "./habit-frequency-list";
import HabitCardFooter from "./habit-card-footer";
import Divider from "@/components/ui/divider";
import { SheetManager } from "react-native-actions-sheet";
import HabitDateList from "./habit-date-list";
import { HabitProgressEntry } from "@/api/api";
export type HabitProp = {
  id: string;
  habit_name: string;
  category: string;
  reminder_time: string;
  frequency: number[];
  habit_color: string;
  created_at: string;
  archived: boolean;
  progress: HabitProgressEntry[];
};

const HabitCard = (props: HabitProp) => {
  const { habit_name, category, archived, progress } = props;
  const MemoizedHabitDateList = memo(HabitDateList);
  const MemoizedFrequencyList = memo(HabitFrequencyList);

  const onPressThreeDot = () => {
    SheetManager.show("habit-details", {
      payload: { data: props },
    });
  };

  return (
    <Pressable
      key={"habit-card-" + props.id}
      // layout={LinearTransition.springify().damping(40).stiffness(200)}
      onPress={() =>
        SheetManager.show("habit-details", { payload: { data: props } })
      }
      style={styles.container}
    >
      <HabitCardHead habitName={habit_name} category={category} />
      <MemoizedFrequencyList frequency={props.frequency} />
      {!archived && (
        <MemoizedHabitDateList habitId={props.id} habitProgress={progress} />
      )}
      <Divider style={{ marginVertical: verticalScale(12) }} />
      <HabitCardFooter onPressThreeDot={onPressThreeDot} habitId={props.id} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(18, 2, 33, 1)",
    borderRadius: horizontalScale(8),
    padding: horizontalScale(16),
  },
});

export default HabitCard;
