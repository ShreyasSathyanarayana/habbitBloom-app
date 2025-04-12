import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  status: "pending" | "approved" | "rejected" | "in_progress";
};

const Status = ({ status }: Props) => {
  const statusMap = {
    pending: "Pending ⏳",
    approved: "Resolved ✅",
    rejected: "Rejected ❌",
    in_progress: "In Progress 🛠️",
  };
  return <ThemedText style={styles.textStyle}>{statusMap[status]}</ThemedText>;
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: getFontSize(14),
  },
});

export default Status;
