import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  status: "pending" | "approved" | "rejected" | "in_progress";
};
 export const statusMap = {
   pending: "Pending ⏳",
   approved: "Resolved ✅",
   rejected: "Rejected ❌",
   in_progress: "In Progress 🛠️",
 };

const Status = ({ status }: Props) => {
 
  const statusColorMap = {
    pending: "rgba(255, 149, 0, 1)",
    approved: "rgba(42, 181, 20, 1)",
    rejected: "rgba(255, 59, 48, 1)",
    in_progress: "rgba(138, 43, 226, 1)",
  };
  return (
    <ThemedText style={[styles.textStyle, { color: statusColorMap[status] }]}>
      {statusMap[status]}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: getFontSize(14),
  },
});

export default Status;
