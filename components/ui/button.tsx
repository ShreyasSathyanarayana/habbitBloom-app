import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { StyleSheet, TouchableOpacityProps, View } from "react-native";
import { ThemedText } from "./theme-text";
import { getFontSize } from "@/font";
type Props = {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  outline?: boolean;
  isLoading?: boolean;
} & TouchableOpacityProps;

const Button = ({
  outline,
  labelStyle,
  label,
  style,
  isLoading,
  disabled,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnStyle,
        outline && styles.outLineBtnStyle,
        style,
        disabled && { opacity: 0.5 },
      ]}
      {...rest}
      disabled={disabled}
    >
      {!isLoading && (
        <ThemedText
          style={[
            { fontSize: getFontSize(14) },
            outline && styles.outLineText,
            labelStyle,
          ]}
        >
          {label}
        </ThemedText>
      )}
      {isLoading && (
        <ActivityIndicator color={"white"} size={"small"} animating={true} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    flexDirection: "row",
    paddingVertical: verticalScale(13),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: horizontalScale(6),
    backgroundColor: "rgba(138, 43, 226, 1)",
    borderWidth: horizontalScale(1),
    borderColor: "rgba(138, 43, 226, 1)",
    width: "100%",
    // flex: 1,
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
