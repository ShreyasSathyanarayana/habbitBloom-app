import { horizontalScale } from "@/metric";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ui/theme-text";
import { getFontSize } from "@/font";
import { Text } from "react-native";

type Props = {
  leftIcon: React.ReactNode;
  buttonName: string;
  onPress?: () => void;
  selected?: boolean;
  labelStyle?: TextStyle;
};

const ActionSheetButton = ({
  leftIcon,
  buttonName,
  onPress,
  selected,
  labelStyle,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.continer}>
      {leftIcon}
      <ThemedText style={[{ fontSize: getFontSize(14), flex: 1 }, labelStyle]}>
        {buttonName}
      </ThemedText>
      {selected && <View style={styles.dot} />}
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
  dot: {
    backgroundColor: "rgba(138, 43, 226, 1)",
    width: horizontalScale(10),
    height: horizontalScale(10),
    borderRadius: horizontalScale(10),
  },
});

export default ActionSheetButton;
