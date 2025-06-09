import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import SheetHeader from "../sheet-header";
import AlertButton from "../alert-button";
import { usePostStore } from "@/store/post-store";
import { ThemedText } from "@/components/ui/theme-text";
import { verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import { router } from "expo-router";

const closeSheet = () => {
  SheetManager.hide("exit-confirmation");
};

const ExitConfirmationSheet = (props: SheetProps<"exit-confirmation">) => {
  const { resetForm } = usePostStore();
  const onYesClick = () => {
    closeSheet();
    resetForm();
    router.back();
  };
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <View style={styles.container}>
        <SheetHeader title="Discard changes?" onClose={closeSheet} />

        <ThemedText style={{ fontSize: getFontSize(14) }}>
          You have unsaved changes. Are you sure you want to discard them?{" "}
        </ThemedText>
        <AlertButton
          firstBtnLabel="Don't leave"
          firstBtnAction={closeSheet}
          secondBtnLabel="Discard"
          secondBtnAction={onYesClick}
        />
      </View>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
  },
});

export default ExitConfirmationSheet;
