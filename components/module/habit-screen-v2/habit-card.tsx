import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { HabitCardProp } from "./type";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import { LinearGradient } from "expo-linear-gradient";
import HabitCardHead from "../habit-screen/habit-card-head";
import HabitFrequencyList from "../habit-screen/habit-frequency-list";
import HabitCardFooterV2 from "../habit-screen/habit-card-footer-v2";
import { SheetManager } from "react-native-actions-sheet";
import { Divider } from "@rneui/base";
import HabitDateList from "../habit-screen/habit-date-list";

const HabitCard = (props: HabitCardProp) => {
  const { habit_name, category, archived, progress } = props;

  const onPressThreeDot = () => {
    SheetManager.show("habit-details", {
      payload: { data: props },
    });
  };

  return (
    <Pressable
      key={"habit-card-" + props.id}
      onPress={() =>
        SheetManager.show("habit-details", { payload: { data: props } })
      }
    >
      <LinearGradient
        colors={["#2B0053", "#000000"]}
        start={{ x: 0.0147, y: 0.111 }} // Approximation of 111.3deg
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <HabitCardHead habitName={habit_name} category={category} />
        <HabitFrequencyList frequency={props.frequency} />
        <HabitDateList habitId={props.id} habitProgress={props.progress} />
        {/* <MemoziedHabitDateV2
          habitId={props.id}
          habitProgress={props.progress}
        /> */}
        <Divider
          color="rgba(194, 194, 194, 0.1)"
          style={{
            marginVertical: horizontalScale(12),
            backgroundColor: "rgba(194, 194, 194, 0.1)",
          }}
        />
        <HabitCardFooterV2
          isHabitPublic={props.public}
          onPressThreeDot={onPressThreeDot}
          habitId={props.id}
          stats={props.stats}
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
