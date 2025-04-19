import { getHabitStats, markHabitStatus } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { HabitProp } from "./habit-card";
import moment from "moment";
import { useHabitStore } from "@/store/habit-store";
import { SheetManager } from "react-native-actions-sheet";
type Props = {
  date: string;
  status: boolean | null;
  habitId: string;
};

const HabitDateButton = ({ date, status, habitId }: Props) => {
  const [localStatus, setLocalStatus] = useState<boolean | null>(status);
  const day = moment(date).local().get("date");
  const todayDate = moment().local().get("date");
  // console.log("todayDate", todayDate, day);
  const selectedFilter = useHabitStore((state) => state.selectedFilter);
  const isToday = day === todayDate;
  const isTodayStatus = isToday && localStatus !== true;
  const toast = useToast();
  const queryClient = useQueryClient();
  useCallback(() => {
    setLocalStatus(status);
  }, [status]);
  const mutation = useMutation({
    mutationKey: ["markHabitStatus"],
    mutationFn: () => {
      return markHabitStatus(habitId, !localStatus, date); // Toggle the habit status (true/false)
    },
    onSuccess: async () => {
      // 1. Fetch updated stats
      const updatedStats = await getHabitStats(habitId);
      !localStatus && SheetManager.show("marked-habit");

      // 2. Update query cache
      queryClient.setQueryData(
        ["habitList", true, selectedFilter],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: HabitProp[]) =>
              page.map((habit) => {
                if (habit.id !== habitId) return habit;

                // Update the specific date's status in the progress array
                const updatedProgress = habit.progress.map((entry) =>
                  moment.utc(entry.date).local().format("YYYY-MM-DD") ===
                  moment.utc(date).local().format("YYYY-MM-DD")
                    ? { ...entry, status: !localStatus }
                    : entry
                );

                return {
                  ...habit,
                  stats: {
                    ...habit.stats,
                    ...updatedStats,
                  },
                  progress: updatedProgress,
                };
              })
            ),
          };
        }
      );

      // 3. Update local UI state and show toast
      setLocalStatus((prev) => !prev);
      localStatus &&
        toast.show(
          !localStatus ? "Marked Successfully" : "Unmarked Successfully",
          {
            type: "success",
          }
        );
    },
  });

  const onPress = () => {
    if (localStatus === null && isToday) {
      toast.show("This habit isn't set for today.", {
        type: "warning",
      });
      return;
    }
    if (!isToday) {
      toast.show("Only today’s tasks can be marked as done.", {
        type: "warning",
      });
    } else {
      mutation.mutateAsync();
    }
  };

  return (
    <Skeleton show={mutation.isPending}>
      <TouchableHighlight
        onPress={onPress}
        // disabled={!isToday && (status === null || status == false)}
        style={[
          styles.container,
          isTodayStatus
            ? styles.todayBtn
            : localStatus === null
            ? styles.disableBtn
            : localStatus === true
            ? styles.completed
            : styles.notCompleted,
          localStatus == null && styles.disableBtn,
        ]}
      >
        <ThemedText
          style={[
            { fontSize: getFontSize(13), fontFamily: "PoppinsSemiBold" },
            (localStatus === null || (localStatus == false && !isToday)) && {
              color: "rgba(179, 179, 179, 0.7)",
            },
          ]}
        >
          {day}
        </ThemedText>
      </TouchableHighlight>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderWidth: horizontalScale(2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: horizontalScale(8),
    // borderColor: "rgba(138, 43, 226, 1)",
  },
  disableBtn: {
    borderColor: "rgba(217, 217, 217, 0.2)",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
  },
  completed: {
    borderColor: "rgba(52, 199, 89, 1)",
    backgroundColor: "rgba(131, 191, 146, 0.3)",
  },
  notCompleted: {
    borderColor: "rgba(255, 59, 48, 0.3)",
    backgroundColor: "rgba(255, 59, 48, 0.3)",
  },
  todayBtn: {
    borderColor: "white",
  },
});

export default HabitDateButton;
