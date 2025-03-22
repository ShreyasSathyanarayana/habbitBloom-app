import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import React from "react";
import { StyleSheet, View } from "react-native";
import { weekList } from "./habit-frequency-list";
type Props = {
  date: string;
};

const WeekName = ({ date }: Props) => {
  const day = new Date(date).getDay();
  // console.log("day", day);

  return (
    <ThemedText
      style={{ fontSize: getFontSize(12), color: "rgba(255, 255, 255, 1)" }}
    >
      {weekList[day]}
    </ThemedText>
  );
};

const styles = StyleSheet.create({});

export default WeekName;
