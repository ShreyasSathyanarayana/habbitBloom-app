import HabitCardHead from "@/components/module/habit-screen/habit-card-head";
import HabitFrequencyList from "@/components/module/habit-screen/habit-frequency-list";
import Divider from "@/components/ui/divider";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import CalenderIcon from "@/assets/svg/calender-icon.svg";
import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import StatsIcon from "@/assets/svg/stats-icon.svg";
import EditIcon from "@/assets/svg/edit-icon.svg";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import ArchiveIcon from "@/assets/svg/archive-icon.svg";
import UnArchiveIcon from "@/assets/svg/unarchive-icon.svg";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveHabit, deleteHabit, unarchiveHabit } from "@/api/api";
import { useToast } from "react-native-toast-notifications";

const _iconSize = horizontalScale(24);
const closeSheet = () => {
  SheetManager.hide("habit-details");
};

const HabitDetailsSheet = (props: SheetProps<"habit-details">) => {
  const payload = props?.payload?.data;
  const toast = useToast();
  const queryClient = useQueryClient();

  const archiveHabitMutation = useMutation({
    mutationKey: ["archiveHabit"],
    mutationFn: () => {
      closeSheet();
      return archiveHabit(payload?.id ?? "");
    },
    onSuccess: (isSuccess: boolean) => {
      queryClient.invalidateQueries({ queryKey: ["habitList"] });
      toast.show(`${payload?.habit_name} Archived`, {
        type: "success",
      });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });

  const unArchiveHabitMutation = useMutation({
    mutationKey: ["unArchiveHabit"],
    mutationFn: () => {
      closeSheet();
      return unarchiveHabit(payload?.id ?? "");
    },
    onSuccess: () => {
      // console.log("unarchived");
      queryClient.invalidateQueries({ queryKey: ["habitList"] });
      queryClient.invalidateQueries({ queryKey: ["habitArchive"] });

      toast.show(`${payload?.habit_name} Unarchived`, {
        type: "success",
      });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });

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
    <View>
      <ActionSheet
        id={props.sheetId}
        containerStyle={{
          backgroundColor: "black", // Fix for Android transparency issue
          paddingBottom: horizontalScale(16),
          paddingHorizontal: horizontalScale(16),
          //   paddingVertical: verticalScale(24),
        }}
        indicatorStyle={{
          backgroundColor: "white",
          marginTop: verticalScale(16),
          width: horizontalScale(80),
          marginBottom: verticalScale(24),
        }}
        gestureEnabled={true}
      >
        <HabitCardHead
          habitName={payload?.habit_name ?? ""}
          category={payload?.category ?? ""}
        />
        <HabitFrequencyList frequency={payload?.frequency ?? []} />
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <ActionSheetButton
            onPress={() =>
              router.push(
                `/(protected)/analytics?id=${payload?.id}&category=calender`
              )
            }
            leftIcon={<CalenderIcon width={_iconSize} height={_iconSize} />}
            buttonName={"Calender"}
          />
          <ActionSheetButton
            onPress={() =>
              router.push(
                `/(protected)/analytics?id=${payload?.id}&category=statistics`
              )
            }
            leftIcon={<StatsIcon width={_iconSize} height={_iconSize} />}
            buttonName="Statistics"
          />
          {/* <ActionSheetButton
            onPress={() => {
              closeSheet();
              router.push(`/(protected)/create-habit?id=${payload?.id}`);
            }}
            leftIcon={<EditIcon width={_iconSize} height={_iconSize} />}
            buttonName="Edit"
          /> */}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          {!payload?.archived && (
            <ActionSheetButton
              onPress={() => archiveHabitMutation.mutateAsync()}
              leftIcon={<ArchiveIcon width={_iconSize} height={_iconSize} />}
              buttonName="Archive"
            />
          )}
          {payload?.archived && (
            <ActionSheetButton
              onPress={() => unArchiveHabitMutation.mutateAsync()}
              leftIcon={<UnArchiveIcon width={_iconSize} height={_iconSize} />}
              buttonName="Unarchive"
            />
          )}

          <ActionSheetButton
            onPress={() => deleteHabitMutation.mutateAsync()}
            leftIcon={<DeleteIcon width={_iconSize} height={_iconSize} />}
            buttonName="Delete"
          />
        </View>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "rgba(38, 50, 56, 0.7)",
    marginVertical: verticalScale(20),
    height: verticalScale(2),
  },
  buttonContainer: {
    gap: verticalScale(24),
  },
});

export default HabitDetailsSheet;
