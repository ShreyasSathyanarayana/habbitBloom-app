import { archiveHabit, deleteHabit } from "@/api/api";
import ActionSheetContainer from "@/components/ui/action-sheet-container";
import { ThemedText } from "@/components/ui/theme-text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";
import SheetHeader from "../sheet-header";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import Button from "@/components/ui/button";
import AlertButton from "../alert-button";
import {
  cancelNotification,
  scheduleNotification,
} from "@/services/notificationService";
import { useAuth } from "@/context/AuthProvider";
import { useHabitStore } from "@/store/habit-store";
// import Button from "@/components/ui/button";
const closeSheet = () => {
  SheetManager.hide("delete-habit");
};

const DeleteHabitSheet = (props: SheetProps<"delete-habit">) => {
  const payload = props?.payload?.data;
  const toast = useToast();
  const { isConnected } = useAuth();
  const selectedFilter = useHabitStore((state) => state.selectedFilter);
  const queryClient = useQueryClient();
  const deleteHabitMutation = useMutation({
    mutationKey: ["deleteHabit"],
    mutationFn: () => {
      return deleteHabit(payload?.id ?? "");
    },
    onSuccess: () => {
      cancelNotification(payload?.id ?? "");
      // queryClient.invalidateQueries({ queryKey: ["habitList"] });
      queryClient.setQueryData(
        ["habitList", isConnected, selectedFilter],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any[]) =>
              page.filter((habit) => habit.id !== payload?.id)
            ),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["habitArchive"] });
      queryClient.invalidateQueries({ queryKey: ["completed-habit"] });
      queryClient.invalidateQueries({ queryKey: ["habitCount"] });
      toast.show("Habit Deleted", {
        type: "success",
      });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
    onSettled: () => {
      closeSheet();
      SheetManager.hide("habit-details");
    },
  });
  const archiveHabitMutation = useMutation({
    mutationKey: ["archiveHabit"],
    mutationFn: () => {
      closeSheet();
      return archiveHabit(payload?.id ?? "");
    },
    onSuccess: () => {
      cancelNotification(payload?.id ?? "");
      queryClient.invalidateQueries({ queryKey: ["habitList"] });
      toast.show(`Archived`, {
        type: "success",
      });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <SheetHeader title="Delete Habit?" onClose={closeSheet} />
      <ThemedText
        style={{
          fontSize: getFontSize(14),
          paddingVertical: verticalScale(24),
        }}
      >
        {!payload?.archived
          ? "If you delete this habit, your streaks will be lost. Instead, you can archive it to keep your progress."
          : "This habit is already archived. Deleting it will remove it permanently. Proceed?"}
      </ThemedText>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(8),
        }}
      >
        {!payload?.archived && (
          <Button
            onPress={() => {
              archiveHabitMutation.mutateAsync();
              SheetManager.hide("habit-details");
            }}
            style={{ flex: 1 }}
            outline
            label="Archive"
          />
        )}
        {payload?.archived && (
          <Button
            style={{ flex: 1 }}
            outline
            label="Cancel"
            onPress={() => {
              closeSheet();
            }}
          />
        )}
        <Button
          onPress={() => {
            deleteHabitMutation.mutateAsync();
          }}
          style={{ flex: 1 }}
          label="Delete"
        />
      </View> */}
      {!payload?.archived && (
        <AlertButton
          firstBtnLabel="Archive"
          secondBtnLabel="Delete"
          firstBtnAction={() => {
            archiveHabitMutation.mutateAsync();
            SheetManager.hide("habit-details");
          }}
          secondBtnLoading={deleteHabitMutation.isPending}
          secondBtnAction={() => {
            deleteHabitMutation.mutateAsync();
          }}
        />
      )}
      {payload?.archived && (
        <AlertButton
          firstBtnLabel="Cancel"
          secondBtnLabel="Delete"
          firstBtnAction={() => {
            closeSheet();
          }}
          secondBtnLoading={deleteHabitMutation.isPending}
          secondBtnAction={() => {
            deleteHabitMutation.mutateAsync();
          }}
        />
      )}
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({});

export default DeleteHabitSheet;
