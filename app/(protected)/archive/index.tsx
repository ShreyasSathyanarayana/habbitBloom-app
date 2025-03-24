import { getAllHabitsArchived } from "@/api/api";
import HabitCard from "@/components/module/habit-screen/habit-card";
import NoArchiveHabit from "@/components/module/habit-screen/no-archive-habit";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Index = () => {
  const habitArchiveQuery = useQuery({
    queryKey: ["habitArchive"],
    queryFn: () => getAllHabitsArchived(),
  });

  return (
    <Container>
      <Header title="Archive" />
      {!habitArchiveQuery?.isFetching &&
        habitArchiveQuery?.data?.length == 0 && <NoArchiveHabit />}
      {habitArchiveQuery?.data && habitArchiveQuery?.data?.length > 0 && (
        <View style={{ paddingHorizontal: horizontalScale(16), flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              gap: verticalScale(16),
              paddingVertical: verticalScale(16),
            }}
            keyExtractor={(item) => item.id}
            data={habitArchiveQuery.data}
            renderItem={({ item }) => <HabitCard {...item} />}
          />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Index;
