import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import SheetHeader from "../sheet-header";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import AlertButton from "../alert-button";
const closeSheet = () => {
  SheetManager.hide("delete-profile-pic");
};
const DeleteProfilePicSheet = (props: SheetProps<"delete-profile-pic">) => {
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(24) }}>
        <SheetHeader title="Remove Profile Picture?" onClose={closeSheet} />
        <ThemedText style={{ fontSize: getFontSize(14) }}>
          Are you sure you want to remove your profile picture? This will reset
          your profile image to the default avatar.
        </ThemedText>
        <AlertButton
          firstBtnAction={closeSheet}
          firstBtnLabel="Cancel"
          secondBtnAction={props.payload?.action}
          secondBtnLabel="Delete"
        />
      </View>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({});

export default DeleteProfilePicSheet;
