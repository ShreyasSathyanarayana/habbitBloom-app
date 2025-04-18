import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import { getCategoryByName } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import CompletedHabitIcon from "@/assets/svg/completed-badge.svg";
import HabitCompletedTagIcon from "@/assets/svg/habit-completed-tag.svg";
type Props = {
  habitName: string;
  category: string;
  completed?: boolean;
};

const HabitCardHead = ({ habitName, category, completed }: Props) => {
  const categoryDetails = getCategoryByName(category);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8A2BE2", "#34127E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        //   style={styles.card}
        style={{
          width: horizontalScale(50),
          height: horizontalScale(50),
          justifyContent: "center",
          alignItems: "center",
          borderRadius: horizontalScale(8),
        }}
      >
        {categoryDetails?.icon}
      </LinearGradient>
      <ThemedText
        numberOfLines={2}
        style={{ fontFamily: "PoppinsMedium", flex: 1 }}
      >
        {habitName}
      </ThemedText>
      {completed && <CompletedHabitIcon />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
});

export default HabitCardHead;
