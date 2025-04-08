import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import SheetHeader from "../sheet-header";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import AlertButton from "../alert-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfilePic } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
const closeSheet = () => {
  SheetManager.hide("delete-profile-pic");
};
const DeleteProfilePicSheet = (props: SheetProps<"delete-profile-pic">) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const deleteMutation = useMutation({
    mutationKey: ["deleteProfilePic"],
    mutationFn: () => deleteProfilePic(),
    onSuccess: () => {
      SheetManager.hide("profile-pic");
      closeSheet();
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
    },
    onError: () => {
      SheetManager.hide("profile-pic");
      closeSheet();
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(24) }}>
        <SheetHeader title="Remove Avatar?" onClose={closeSheet} />
        <ThemedText style={{ fontSize: getFontSize(14) }}>
          Are you sure you want to remove your current avatar?
        </ThemedText>
        <AlertButton
          firstBtnAction={closeSheet}
          secondBtnLoading={deleteMutation.isPending}
          firstBtnLabel="Cancel"
          secondBtnAction={() => deleteMutation.mutateAsync()}
          secondBtnLabel="Delete"
        />
      </View>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({});

export default DeleteProfilePicSheet;
