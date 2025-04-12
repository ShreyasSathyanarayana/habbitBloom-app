import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CardSwipeContainer from "../suggestion/ui/card-swipe-container";
import { ThemedText } from "@/components/ui/theme-text";
import { SuggestionWithProfile } from "@/api/api";
import { verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import CategoryChip from "../suggestion/ui/category-chip";
import TimeAgoOrToday from "../suggestion/ui/TimeAgoOrToday";
import Status from "../suggestion/ui/status";
import { router } from "expo-router";

const SuperSuggestionCard = ({
  id,
  category,
  created_at,
  description,
  profile,
  status,
  updated_at,
  user_id,
  title,
  handleDelete,
}: SuggestionWithProfile & { handleDelete: (id: string) => void }) => {
  return (
    <CardSwipeContainer id={id} handleDelete={handleDelete}>
      <Pressable
        onPress={() =>
          router.push(
            `/(protected)/super-user-suggestion/update-suggestion?title=${title}&categories=${category}&description=${description}&status=${status}&id=${id}`
          )
        }
        style={styles.container}
      >
        <ThemedText style={{ fontSize: getFontSize(12) }}>
          {profile.full_name} {`(${profile.email})`}
        </ThemedText>
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
      </Pressable>
    </CardSwipeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(8),
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SuperSuggestionCard;
