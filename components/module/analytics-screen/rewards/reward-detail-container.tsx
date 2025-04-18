import { verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  children: React.ReactNode;
};

const RewardDetailContainer = ({ children }: Props) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(5),
    alignItems: "center",
  },
});

export default RewardDetailContainer;
