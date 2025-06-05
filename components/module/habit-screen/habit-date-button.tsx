import { getHabitStats, markHabitStatus } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
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
  const toast = useToast();
  const queryClient = useQueryClient();
  const selectedFilter = useHabitStore((state) => state.selectedFilter);

  const day = useMemo(() => moment(date).local().date(), [date]);
  const todayDate = useMemo(() => moment().local().date(), []);
  const isToday = day === todayDate;
  const canToggle = isToday && localStatus !== true;

  const mutation = useMutation({
    mutationKey: ["markHabitStatus"],
    mutationFn: () => markHabitStatus(habitId, !localStatus, date),
    onSuccess: async () => {
      const updatedStats = await getHabitStats(habitId);

      // if (!localStatus) {
      //   SheetManager.show("marked-habit");
      // }

      queryClient.setQueryData(
        ["habitList", true, selectedFilter],
        (oldData: any) => {
          if (!oldData) return oldData;

          const formattedDate = moment.utc(date).local().format("YYYY-MM-DD");

          return {
            ...oldData,
            pages: oldData.pages.map((page: HabitProp[]) =>
              page.map((habit) => {
                if (habit.id !== habitId) return habit;

                const updatedProgress = habit.progress.map((entry) =>
                  moment.utc(entry.date).local().format("YYYY-MM-DD") ===
                  formattedDate
                    ? { ...entry, status: !localStatus }
                    : entry
                );

                return {
                  ...habit,
                  stats: { ...habit.stats, ...updatedStats },
                  progress: updatedProgress,
                };
              })
            ),
          };
        }
      );

      setLocalStatus((prev) => !prev);

      // toast.show(
      //   !localStatus ? "Marked Successfully" : "Unmarked Successfully",
      //   { type: "success" }
      // );
    },
  });

  const onPress = () => {
    if (localStatus === null && isToday) {
      toast.show("This habit isn't set for today.", { type: "warning" });
      return;
    }

    if (!isToday) {
      toast.show("Only today’s tasks can be marked as done.", {
        type: "warning",
      });
      return;
    }

    mutation.mutateAsync();
  };

  const containerStyle = useMemo(() => {
    if (canToggle && localStatus !== null) return styles.todayBtn;
    if (localStatus === null) return styles.disableBtn;
    return localStatus ? styles.completed : styles.notCompleted;
  }, [canToggle, localStatus]);

  const textStyle = useMemo(() => {
    const base = { fontSize: getFontSize(13), fontFamily: "PoppinsSemiBold" };
    const isDimmed = localStatus === null || (!localStatus && !isToday);
    return [base, isDimmed && { color: "rgba(179, 179, 179, 0.7)" }];
  }, [localStatus, isToday]);

  if (mutation.isPending) {
    return (
      <Skeleton width={horizontalScale(32)} height={horizontalScale(32)} />
    );
  }

  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <ThemedText style={textStyle}>{day}</ThemedText>
    </TouchableHighlight>
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
