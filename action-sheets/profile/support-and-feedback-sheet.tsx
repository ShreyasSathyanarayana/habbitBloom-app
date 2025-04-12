import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import SheetHeader from "../sheet-header";
import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import { horizontalScale, verticalScale } from "@/metric";
import SuggestionIcon from "@/assets/svg/suggestion-icon.svg";
import ShareIcon from "@/assets/svg/share-icon.svg";
import RateAppIcon from "@/assets/svg/rate-icon.svg";
import { getFontSize } from "@/font";
import { router } from "expo-router";
import { getUserRole } from "@/utils/persist-storage";
const _iconSize = horizontalScale(24);
const closeSheet = () => {
  SheetManager.hide("support-and-feedback");
};
const SupportAndFeedbackSheet = (props: SheetProps<"support-and-feedback">) => {
  const userRole = getUserRole();
  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(24) }}>
        {userRole === "admin" && (
          <ActionSheetButton
            onPress={() => {
              closeSheet();
              router.push("/(protected)/super-user-suggestion");
            }}
            leftIcon={<SuggestionIcon width={_iconSize} height={_iconSize} />}
            buttonName={"Suggestion Box"}
            labelStyle={styles.textStyle}
          />
        )}
        <ActionSheetButton
          leftIcon={<ShareIcon width={_iconSize} height={_iconSize} />}
          buttonName={"Share Our App"}
          labelStyle={styles.textStyle}
        />
        <ActionSheetButton
          leftIcon={<RateAppIcon width={_iconSize} height={_iconSize} />}
          buttonName={"Rate Us"}
          labelStyle={styles.textStyle}
        />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
  },
});

export default SupportAndFeedbackSheet;
