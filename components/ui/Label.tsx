import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
// import { HelperText } from 'react-native-paper';

interface LabelProps {
  children?: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  helperComponent?: React.ReactNode;
  labelStyle?: StyleProp<ViewStyle>;
}

const Label: React.FC<LabelProps> = ({
  label,
  children,
  helperText,
  labelStyle,
  error,
  success,
  helperComponent,
}) => {
  let helperTextColor = "rgba(255, 255, 255, 1)";
  if (error) {
    helperTextColor = "rgba(255, 0, 0, 1)";
  } else if (success) {
    helperTextColor = "rgba(0, 255, 0, 0.6)";
  }

  return (
    <View style={labelStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      {children}
      {helperText ? (
        <Text style={[styles.helperText, { color: helperTextColor }]}>
          {helperText}
        </Text>
      ) : null}
      {helperComponent}
    </View>
  );
};

export default Label;

const styles = StyleSheet.create({
  label: {
    fontSize: getFontSize(16),
    marginBottom: 8,
    color: "white",
    fontFamily: "Poppins_500Medium",
  },
  helperText: {
    fontSize: getFontSize(12),
    // fontWeight: 400,
    marginTop: verticalScale(4),
    fontFamily: "Poppins_400Regular",
    marginLeft: horizontalScale(15),
  },
});
