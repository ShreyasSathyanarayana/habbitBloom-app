import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  style?: ViewStyle;
};

const Divider = ({ style }: Props) => {
  return <View style={[styles.divider, style]}></View>;
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(194, 194, 194, 0.1)",
  },
});

export default Divider;
