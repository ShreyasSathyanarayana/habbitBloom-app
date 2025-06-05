import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import { getCategoryByName } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import HabitCompletedTagIcon from "@/assets/svg/habit-completed-tag.svg";
import RightArrowIcon from "@/assets/svg/right-arrow.svg";

type Props = {
  habitName: string;
  category: string;
  onPress?: () => void;
};
const _iconSize = horizontalScale(40);

const HabitTrackCard = ({ habitName, category, onPress }: Props) => {
  const categoryDetails = useMemo(() => {
    return getCategoryByName(category);
  }, [category]);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
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
        {categoryDetails}
      </LinearGradient>
      <ThemedText
        numberOfLines={2}
        style={{ fontFamily: "PoppinsMedium", flex: 1 }}
      >
        {habitName}
      </ThemedText>
      <RightArrowIcon
        width={horizontalScale(18)}
        height={horizontalScale(18)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
});

export default HabitTrackCard;
