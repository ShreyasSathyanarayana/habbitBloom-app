import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  chipName: string;
  selected?: boolean;

};

const Chip = ({ chipName,selected }: Props) => {
  return (
    <View
      style={[
        styles.container,
        selected && { backgroundColor: "rgba(138, 43, 226, 1)" },
      ]}
    >
      <ThemedText
        style={{ fontSize: getFontSize(14), textTransform: "capitalize" }}
      >
        {chipName}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: horizontalScale(4),
    borderRadius: horizontalScale(12),
    borderColor: "white",
    borderWidth: horizontalScale(1.2),
    paddingHorizontal: horizontalScale(8),
  },
});

export default Chip;
