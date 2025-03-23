import { deleteHabit } from "@/api/api";
import ActionSheetContainer from "@/components/ui/action-sheet-container";
import { ThemedText } from "@/components/ui/theme-text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";
import SheetHeader from "./sheet-header";
import { getFontSize } from "@/font";
import { verticalScale } from "@/metric";
const closeSheet = () => {
  SheetManager.hide("delete-habit");
};

const DeleteHabitSheet = (props: SheetProps<"delete-habit">) => {
  const payload = props?.payload;
  const toast = useToast();
  const queryClient = useQueryClient();
  const deleteHabitMutation = useMutation({
    mutationKey: ["deleteHabit"],
    mutationFn: () => {
      closeSheet();
      return deleteHabit(payload?.id ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habitList"] });
      queryClient.invalidateQueries({ queryKey: ["habitArchive"] });
      toast.show("Habit Deleted", {
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
      <SheetHeader  title="Delete Habit?" onClose={closeSheet} />
      <ThemedText
        style={{
          fontSize: getFontSize(14),
          paddingVertical: verticalScale(24),
        }}
      >
        If you delete this habit, your streaks will be lost.Instead, you can
        archive it to keep your progress.
      </ThemedText>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({});

export default DeleteHabitSheet;
