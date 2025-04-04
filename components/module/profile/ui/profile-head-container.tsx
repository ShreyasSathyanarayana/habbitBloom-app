import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children?: React.ReactNode;
};

const ProfileHeadContainer = ({ children }: Props) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top + 10 }]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: horizontalScale(16),
    backgroundColor: "rgba(138, 43, 226, 0.9)",
    borderBottomRightRadius: horizontalScale(24),
    borderBottomLeftRadius: horizontalScale(24),
  },
});

export default ProfileHeadContainer;
