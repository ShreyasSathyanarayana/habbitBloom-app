import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  icon: React.ReactNode;
};

const ProfileSheetOption = ({ icon }: Props) => {
  return <View style={styles.container}>{icon}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: horizontalScale(1),
    borderColor: "rgba(138, 43, 226, 0.48)",
    borderRadius: horizontalScale(8),
    justifyContent: "center",
    alignItems: "center",
    padding: horizontalScale(12),
  },
});

export default ProfileSheetOption;
