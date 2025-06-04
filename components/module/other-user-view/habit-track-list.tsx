import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import HabitTrackerIcon from "@/assets/svg/habit-tracker.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { OtherUserHabit } from "@/api/api";
import HabitTrackCard from "./habit-track-card";
import { Divider } from "@rneui/base";
import { router } from "expo-router";
import EmptyHabitListIcon from "@/assets/svg/Empty-habit-icon.svg";
import { Skeleton } from "moti/skeleton";

type HabitTrackListProps = {
  habits: OtherUserHabit[];
  isLoading?: boolean;
};

const HabitTrackList = (props: HabitTrackListProps) => {
  if (!props?.isLoading && props?.habits?.length === 0) {
    return <EmptyHabitList />;
  }

  return (
    <Skeleton show={props?.isLoading}>
      <View style={styles.container}>
        <View style={styles.row}>
          <HabitTrackerIcon
            width={horizontalScale(24)}
            height={horizontalScale(24)}
          />
          <ThemedText style={{ fontSize: getFontSize(12) }}>
            Tracked Habits
          </ThemedText>
        </View>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={{ paddingTop: verticalScale(24) }}
          data={props.habits}
          ItemSeparatorComponent={() => (
            <Divider
              color="rgba(255, 255, 255, 0.18)"
              style={{ marginVertical: verticalScale(16) }}
            />
          )}
          renderItem={({ item }) => (
            <HabitTrackCard
              habitName={item?.habit_name}
              category={item?.category}
              onPress={() => {
                // Handle habit card press if needed
                router.push(
                  `/(protected)/analytics?id=${item?.id}&category=Calendar&otherUserView=otherUser` // Assuming you want to navigate to analytics with otherUserView
                );
              }}
            />
          )}
        />
      </View>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(18, 2, 33, 1)",
    borderWidth: horizontalScale(1),
    borderColor: "rgba(255, 255, 255, 0.5)",
    padding: horizontalScale(16),
    borderRadius: horizontalScale(16),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(250),
    gap: verticalScale(10),
  },
});

export default HabitTrackList;

const EmptyHabitList = () => {
  return (
    <View style={styles.emptyContainer}>
      <EmptyHabitListIcon
        width={horizontalScale(108)}
        height={horizontalScale(120)}
      />
      <ThemedText style={{ fontSize: getFontSize(12) }}>
        No habits to show yet
      </ThemedText>
    </View>
  );
};
