import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import CurrentStreak from "./current-streak";
type Props = {
  habitId: string;
};

const CalenderAnalytics = ({ habitId }: Props) => {
  return (
    <View>
      <CurrentStreak habitId={habitId} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CalenderAnalytics;
