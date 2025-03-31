import { markHabitStatus } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
type Props = {
  date: string;
  status: boolean | null;
  habitId: string;
};

const HabitDateButton = ({ date, status, habitId }: Props) => {
  const day = new Date(date).getDate();
  const todayDate = new Date().getDate();
  const isToday = day === todayDate;
  const isTodayStatus = isToday && status !== true;
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["markHabitStatus"],
    mutationFn: () => {
      return markHabitStatus(habitId, !status, date);
    },
    onSuccess: () => {
      toast.show(!status ? "Marked Successfully" : "Unmarked Successfully", {
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["habitDates", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habit-stats", habitId] });
    },
  });

  const onPress = () => {
    if (status === null && isToday) {
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
            : status === null
            ? styles.disableBtn
            : status === true
            ? styles.completed
            : styles.notCompleted,
          status == null && styles.disableBtn,
        ]}
      >
        <ThemedText
          style={[
            { fontSize: getFontSize(13), fontFamily: "PoppinsSemiBold" },
            (status === null || (status == false && !isToday)) && {
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
