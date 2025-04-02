import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import SheetHeader from "./sheet-header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import Button from "@/components/ui/button";
import AlertButton from "./alert-button";
const closeSheet = () => {
  SheetManager.hide("hide-habit");
};

const HideHabitSheet = (props: SheetProps<"hide-habit">) => {
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <SheetHeader title="Hide from Achievements" onClose={closeSheet} />
      <ThemedText
        style={{ marginVertical: verticalScale(24), fontSize: getFontSize(14) }}
      >
        This habit will be hidden from your achievements list. Others won’t see
        it in your profile.
      </ThemedText>
      <AlertButton
        firstBtnLabel="Cancel"
        secondBtnLabel="Hide"
        firstBtnAction={closeSheet}
        secondBtnAction={closeSheet}
      />
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({});

export default HideHabitSheet;
