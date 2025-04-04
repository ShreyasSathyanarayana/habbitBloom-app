import { horizontalScale } from "@/metric";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import CalenderIcon from "@/assets/svg/calender-icon.svg";
import StatsIcon from "@/assets/svg/stats-icon.svg";
import ThreeDotIcon from "@/assets/svg/three-dots.svg";
import CloseEye from "@/assets/svg/close-eye.svg";
import OpenEye from "@/assets/svg/open-eye.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHabitStats, updateHabitPublicStatus } from "@/api/api";
import HabitStreak from "./habit-streak";
import HabitComplete from "./habit-complete";
import { router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";

type Props = {
  habitId: string;
  isHabitPublic: boolean;
  onPressThreeDot: () => void;
};

const _iconSize = horizontalScale(20);

const HabitCardFooter = ({
  habitId,
  onPressThreeDot,
  isHabitPublic,
}: Props) => {
  // Optimize API query with caching and data selection
  const { data, isLoading } = useQuery({
    queryKey: ["habit-stats", habitId],
    queryFn: () => getHabitStats(habitId),
    enabled: !!habitId,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    select: (data) => ({
      streak: data.streak,
      completed: data.completed,
      notCompleted: data.notCompleted,
    }),
  });
  const [localIsHabitPublic, setLocalIsHabitPublic] = useState(isHabitPublic);
  const toast = useToast();
  useEffect(() => {
    setLocalIsHabitPublic(isHabitPublic);
  }, [isHabitPublic]);

  const unHideHabitMutation = useMutation({
    mutationKey: ["UnHideHabit"],
    mutationFn: () => {
      return updateHabitPublicStatus(habitId, true);
    },
    onSuccess: () => {
      updateHabitStatus(true);
      toast.show("Habit visible again!", {
        type: "success",
      });
    },
    onError: () => {
      toast.show("Something went worng while updating public status", {
        type: "warning",
      });
    },
  });

  const updateHabitStatus = (status: boolean) => {
    setLocalIsHabitPublic(status);
  };

  // Optimize handlers using useCallback to avoid re-renders
  const navigateToCalendar = useCallback(() => {
    router.push(`/(protected)/analytics?id=${habitId}&category=Calendar`);
  }, [habitId]);

  const navigateToStatistics = useCallback(() => {
    router.push(`/(protected)/analytics?id=${habitId}&category=Statistics`);
  }, [habitId]);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <HabitStreak streakValue={data?.streak} isLoading={isLoading} />
        <HabitComplete
          completedValue={data?.completed}
          notCompletedValue={data?.notCompleted}
          isLoading={isLoading}
        />
      </View>
      <View style={styles.column}>
        {localIsHabitPublic && (
          <TouchableHighlight
            onPress={() =>
              SheetManager.show("hide-habit", {
                payload: { habitId: habitId, updateStatus: updateHabitStatus },
              })
            }
            style={styles.iconWrapper}
          >
            <OpenEye width={_iconSize} height={_iconSize} />
          </TouchableHighlight>
        )}
        {!localIsHabitPublic && (
          <TouchableHighlight
            onPress={() => unHideHabitMutation.mutateAsync()}
            // onPress={() =>
            //   SheetManager.show("hide-habit", { payload: { habitId: habitId } })
            // }
            style={styles.iconWrapper}
          >
            <CloseEye width={_iconSize} height={_iconSize} />
          </TouchableHighlight>
        )}
        <TouchableHighlight
          onPress={navigateToCalendar}
          style={styles.iconWrapper}
        >
          <CalenderIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={navigateToStatistics}
          style={styles.iconWrapper}
        >
          <StatsIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={onPressThreeDot}
          style={styles.iconWrapper}
        >
          <ThreeDotIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(16),
  },
  iconWrapper: {
    paddingVertical: horizontalScale(5),
    paddingHorizontal: horizontalScale(1),
  },
});

export default HabitCardFooter;
