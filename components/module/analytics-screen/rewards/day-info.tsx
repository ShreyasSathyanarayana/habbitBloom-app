import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  day: number;
};

const DayInfo = ({ day = 0 }: Props) => {
  return (
    <ThemedText
      style={{ fontSize: getFontSize(10), color: "rgba(243, 243, 243, 1)" }}
    >
      {day} {day > 1 ? "days" : "day"}
    </ThemedText>
  );
};

const styles = StyleSheet.create({});

export default DayInfo;
