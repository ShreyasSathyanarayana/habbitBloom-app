import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import SheetHeader from "../sheet-header";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { verticalScale } from "@/metric";
import AlertButton from "../alert-button";
import { router } from "expo-router";
const closeSheet = () => {
  SheetManager.hide("habit-limit");
};

const HabitLimitSheet = (props: SheetProps<"habit-limit">) => {
  const payload = props.payload;
  console.log(payload);

  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <SheetHeader
        title={
          payload?.isPremiumUser ? "Maximum Limit Reached" : "Limit Reached!"
        }
        onClose={closeSheet}
      />
      <View style={{ gap: verticalScale(24), paddingTop: verticalScale(16) }}>
        <ThemedText style={{ fontSize: getFontSize(14) }}>
          {!payload?.isPremiumUser &&
            "You can create up to 6 habits with the free plan. Upgrade to unlock up to 20 habits and more features!"}
          {payload?.isPremiumUser &&
            "You've reached the limit of 20 habits. To add a new one, please delete or manage your existing habits."}
        </ThemedText>
        {/**  This is for free user  */}
        {!payload?.isPremiumUser && (
          <AlertButton
            firstBtnLabel="Cancel"
            secondBtnLabel="Explore Plans"
            firstBtnAction={closeSheet}
            secondBtnAction={() => {
              closeSheet();
              router.push("/(protected)/subscription");
            }}
          />
        )}
        {/** This is for premium user */}
        {payload?.isPremiumUser && (
          <AlertButton
            firstBtnLabel="Cancel"
            secondBtnLabel="Manage Habits"
            firstBtnAction={closeSheet}
            secondBtnAction={() => console.log("Manage habits")}
          />
        )}
      </View>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({});

export default HabitLimitSheet;
