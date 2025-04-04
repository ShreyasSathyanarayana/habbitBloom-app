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
import { LinearGradient } from "expo-linear-gradient";
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
  public: boolean;
};

const HabitCard = (props: HabitProp) => {
  const { habit_name, category, archived, progress } = props;
  const MemoizedHabitDateList = memo(HabitDateList);
  const MemoizedFrequencyList = memo(HabitFrequencyList);
  const MemoizedHabitFooter = memo(HabitCardFooter);

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
      // style={styles.container}
    >
      <LinearGradient
        colors={["#2B0053", "#000000"]}
        start={{ x: 0.0147, y: 0.111 }} // Approximation of 111.3deg
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <HabitCardHead habitName={habit_name} category={category} />
        <MemoizedFrequencyList frequency={props.frequency} />
        {!archived && (
          <MemoizedHabitDateList habitId={props.id} habitProgress={progress} />
        )}
        <Divider style={{ marginVertical: verticalScale(12) }} />
        <MemoizedHabitFooter
          isHabitPublic={props.public}
          onPressThreeDot={onPressThreeDot}
          habitId={props.id}
        />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "rgba(18, 2, 33, 1)",
    borderRadius: horizontalScale(16),
    padding: horizontalScale(16),
    borderWidth: horizontalScale(1),
    borderColor: "rgba(138, 43, 226, 1)",
  },
});

export default HabitCard;
