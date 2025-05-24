import React from "react";
import { StyleSheet, View } from "react-native";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import { ThemedText } from "@/components/ui/theme-text";
import TrashCanOutlineIcon from "@/assets/svg/trash-can-outline.svg";
import CardSwipeContainer from "./ui/card-swipe-container";
import CategoryChip from "./ui/category-chip";
import TimeAgoOrToday from "./ui/TimeAgoOrToday";
import Status from "./ui/status";


interface SuggestionCardProps {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  status: "pending" | "approved" | "rejected" | "in_progress"; // You can expand this if needed
  created_at: string; // ISO timestamp
  updated_at: string;
  handleDelete: (id: string) => void;
}
const SuggestionCard = ({
  id,
  user_id,
  title,
  description,
  category,
  status,
  created_at,
  updated_at,
  handleDelete,
}: SuggestionCardProps) => {
  return (
    <CardSwipeContainer id={id} handleDelete={handleDelete}>
      <View style={styles.container}>
        <ThemedText style={{ fontFamily: "PoppinsMedium" }}>{title}</ThemedText>
        <View style={styles.row}>
          <CategoryChip category={category} />
          <TimeAgoOrToday createdAt={created_at} />
        </View>
        <ThemedText style={{ fontSize: getFontSize(14) }}>
          {description}
        </ThemedText>
        <View style={[styles.row, styles.statusContainer]}>
          <Status status={status} />
          <TimeAgoOrToday createdAt={updated_at} />
        </View>
      </View>
    </CardSwipeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(8),
    width: "100%",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusContainer: {
    backgroundColor: "rgba(38, 50, 56, 1)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: horizontalScale(4),
    borderRadius: horizontalScale(8),
  },
});

export default SuggestionCard;
