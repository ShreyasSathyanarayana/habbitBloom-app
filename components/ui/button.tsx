import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleProp, TextStyle, TouchableOpacity } from "react-native";
import { StyleSheet, TouchableOpacityProps, View } from "react-native";
import { ThemedText } from "./theme-text";
import { getFontSize } from "@/font";
type Props = {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  outline?: boolean;
} & TouchableOpacityProps;

const Button = ({ outline, labelStyle, label, style, ...rest }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.btnStyle, outline && styles.outLineBtnStyle, style]}
      {...rest}
    >
      <ThemedText
        style={[
          { fontSize: getFontSize(14) },
          outline && styles.outLineText,
          labelStyle,
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    paddingVertical: verticalScale(13),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: horizontalScale(6),
    backgroundColor: "rgba(138, 43, 226, 1)",
    borderWidth: horizontalScale(1),
    borderColor: "rgba(138, 43, 226, 1)",
    flex: 1,
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  outLineBtnStyle: {
    backgroundColor: "transparent",
    borderWidth: horizontalScale(1),
  },
  outLineText: {
    color: "rgba(138, 43, 226, 1)",
  },
});

export default Button;
