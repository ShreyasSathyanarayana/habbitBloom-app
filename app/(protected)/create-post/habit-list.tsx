import { getOtherUserHabits } from "@/api/api";
import HashTagList from "@/components/module/create-or-edit-post/hash-tag-list";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { horizontalScale } from "@/metric";
import { getUserId } from "@/utils/persist-storage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";

const HabitList = () => {
  const userId = getUserId();
  const otherUserHabitTrackQuery = useQuery({
    queryKey: ["otherUserHabitTrack", userId],
    queryFn: () => getOtherUserHabits(userId as string),
  });

  return (
    <Container>
      <Header title="Habit List" />
      <View style={{ padding: horizontalScale(16) }}>
        <HashTagList
          habits={otherUserHabitTrackQuery?.data ?? []}
          isLoading={otherUserHabitTrackQuery?.isLoading}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default HabitList;
