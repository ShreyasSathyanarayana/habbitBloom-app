import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { getProgressIcon } from "@/assets/progress-icons/get-progress-icon";
import { Skeleton } from "moti/skeleton";

type Props = {
  completedValue?: number;
  notCompletedValue?: number;
  isLoading?: boolean;
};

const HabitComplete = ({
  completedValue = 0,
  notCompletedValue = 0,
  isLoading = false,
}: Props) => {
  const total = completedValue + notCompletedValue;
  const percentage = total > 0 ? Math.round((completedValue / total) * 100) : 0;

  const ProgressIcon = getProgressIcon(percentage);

  return (
    <View style={styles.container}>
      {ProgressIcon}
      <Skeleton show={isLoading}>
        <ThemedText style={styles.text}>{percentage}%</ThemedText>
      </Skeleton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  text: {
    fontSize: getFontSize(12),
    fontFamily: "PoppinsSemiBold",
  },
});

export default HabitComplete;
