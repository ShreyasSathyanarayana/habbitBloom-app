import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { getSuggestionCategoryColor } from "@/utils/constants";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  category: string ;
};

const CategoryChip = ({ category = "Others" }: Props) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getSuggestionCategoryColor(category ?? "") },
      ]}
    >
      <ThemedText style={{ fontSize: getFontSize(12) }}>{category}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: horizontalScale(4),
    paddingHorizontal: horizontalScale(8),
    backgroundColor: "rgba(255, 204, 0, 1)",
    borderRadius: horizontalScale(14),
  },
});

export default CategoryChip;
