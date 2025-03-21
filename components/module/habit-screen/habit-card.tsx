import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import HabitCardHead from "./habit-card-head";
import HabitFrequencyList from "./habit-frequency-list";
import HabitCardFooter from "./habit-card-footer";
import { Dash } from "react-native-ui-lib";
import Divider from "@/components/ui/divider";
type Props = {
  id: string;
  habit_name: string;
  category: string;
  reminder_time: string;
  frequency: number[];
  habit_color: string;
  created_at: string;
};

const HabitCard = (props: Props) => {
  const { habit_name, category } = props;
  
  return (
    <View style={styles.container}>
      <HabitCardHead habitName={habit_name} category={category} />
      <HabitFrequencyList frequency={props.frequency} />
      <Divider style={{ marginVertical: verticalScale(12) }} />
      <HabitCardFooter habitId={props.id} />
    </View>
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
