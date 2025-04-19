import { horizontalScale } from "@/metric";
import React, { useEffect, useState } from "react";
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

const convertToPercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

const HabitComplete = ({
  completedValue = 0,
  notCompletedValue = 0,
  isLoading = false,
}: Props) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (
      typeof completedValue === "number" &&
      typeof notCompletedValue === "number" &&
      !isNaN(completedValue) &&
      !isNaN(notCompletedValue)
    ) {
      setPercentage(
        convertToPercentage(completedValue, completedValue + notCompletedValue)
      );
    } else {
      setPercentage(0);
    }
  }, [completedValue, notCompletedValue]);

  const ProgressIcon = getProgressIcon(percentage); // Ensure it returns a valid React element

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
