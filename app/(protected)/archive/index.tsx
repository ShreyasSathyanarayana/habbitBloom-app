import { getAllHabitsArchived } from "@/api/api";
import NoInternet from "@/components/module/errors/no-internet";
import ServerError from "@/components/module/errors/server-error";
import HabitCard from "@/components/module/habit-screen/habit-card";
import NoArchiveHabit from "@/components/module/habit-screen/no-archive-habit";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { useAuth } from "@/context/AuthProvider";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Index = () => {
  const habitArchiveQuery = useQuery({
    queryKey: ["habitArchive"],
    queryFn: () => getAllHabitsArchived(),
  });
  const { isConnected } = useAuth();
  if (!isConnected) {
    return <NoInternet onRefresh={() => habitArchiveQuery?.refetch()} />;
  }

  return (
    <Container>
      <Header title="Archive" />
      {habitArchiveQuery?.status == "error" && (
        <ServerError onRefresh={() => habitArchiveQuery?.refetch()} />
      )}
      {!habitArchiveQuery?.isFetching &&
        habitArchiveQuery?.data?.length == 0 &&
        habitArchiveQuery?.status !== "error" && <NoArchiveHabit />}
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
