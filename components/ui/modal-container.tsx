import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const ModalContainer = ({ children, style }: Props) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(28, 28, 30, 1)",
    padding: horizontalScale(24),
    borderRadius: horizontalScale(16),
    gap: verticalScale(24),
  },
});

export default ModalContainer;
