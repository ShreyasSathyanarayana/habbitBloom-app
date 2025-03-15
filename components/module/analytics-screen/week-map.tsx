import { fetchWeeklyHabitProgress } from "@/api/api";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

// Props type definition
type WeekMapProps = {
  habitId: string;
};

const _stagger = 100;

const WeekMap = ({ habitId }: WeekMapProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weeklyHabitProgress", habitId],
    queryFn: () => fetchWeeklyHabitProgress(habitId),
  });
//   console.log("habit id response", data?.habitId);
//   console.log("habit data", JSON.stringify(data?.data, null, 2));

  if (isLoading || !data) return null; // Handle loading and null data state appropriately
  if (error) return null; // Handle error state appropriately

  return (
    <Animated.View
      entering={FadeInRight.springify().damping(40).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(40).stiffness(200)}
    >
      <FlatList
        data={data?.data || []}
        contentContainerStyle={styles.container}
        keyExtractor={(_, index) => `weeklyDetails-${index}`}
        renderItem={({ item, index }) => (
          <HabitHeatMap
            date={item?.date || ""}
            status={item?.status}
            index={index}
          />
        )}
      />
    </Animated.View>
  );
};

const HabitHeatMap = ({
  date,
  status,
  index,
}: {
  date: string;
  status: boolean | null;
  index: number;
}) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * _stagger)
        .springify()
        .damping(40)
        .stiffness(200)}
      style={[
        styles.heatMapBox,
        status === true
          ? styles.activeBox
          : status === false
          ? styles.inactiveBox
          : styles.defaultBox,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(16),
  },
  heatMapBox: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(6),
  },
  activeBox: {
    backgroundColor: "rgba(138, 43, 226, 1)",
  },
  inactiveBox: {
    backgroundColor: "rgba(208, 188, 227, 1)",
  },
  defaultBox: {
    backgroundColor: "rgba(67, 67, 67, 1)", // Default color when status is null
  },
});

export default WeekMap;
