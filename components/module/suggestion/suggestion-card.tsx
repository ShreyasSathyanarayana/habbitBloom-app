import React from "react";
import { StyleSheet, View } from "react-native";

import { ListItem } from "@rneui/themed";
import { Button, Icon } from "@rneui/base";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import { ThemedText } from "@/components/ui/theme-text";
import TrashCanOutlineIcon from "@/assets/svg/trash-can-outline.svg";
import CardSwipeContainer from "./ui/card-swipe-container";
import CategoryChip from "./ui/category-chip";
import TimeAgoOrToday from "./ui/TimeAgoOrToday";
import Status from "./ui/status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSuggestionById } from "@/api/api";
import { useToast } from "react-native-toast-notifications";

interface SuggestionCardProps {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  status: "pending" | "approved" | "rejected"; // You can expand this if needed
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
        <View style={styles.row}>
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
});

export default SuggestionCard;
