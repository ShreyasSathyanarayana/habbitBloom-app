import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileSheetOption from "./profile-sheet-option";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import { getFontSize } from "@/font";

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

const ProfileSheetOptionButton = ({ icon, label, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ProfileSheetOption icon={icon} />
      <ThemedText style={{ fontSize: getFontSize(12) }}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: horizontalScale(12),
    alignItems: "center",
  },
});

export default ProfileSheetOptionButton;
