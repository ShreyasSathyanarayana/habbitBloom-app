import { horizontalScale } from "@/metric";
import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ui/theme-text";
import { getFontSize } from "@/font";

type Props = {
  leftIcon: React.ReactNode;
  buttonName: string;
  onPress?: () => void;
};

const ActionSheetButton = ({ leftIcon, buttonName, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.continer}>
      {leftIcon}
      <ThemedText style={{ fontSize: getFontSize(14) }}>
        {buttonName}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  continer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    // flex: 1,
  },
});

export default ActionSheetButton;
