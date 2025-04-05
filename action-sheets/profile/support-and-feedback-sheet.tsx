import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetProps } from "react-native-actions-sheet";
import SheetHeader from "../sheet-header";
import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import { horizontalScale, verticalScale } from "@/metric";
import SuggestionIcon from "@/assets/svg/suggestion-icon.svg";
import ShareIcon from "@/assets/svg/share-icon.svg";
import RateAppIcon from "@/assets/svg/rate-icon.svg";
import { getFontSize } from "@/font";
const _iconSize = horizontalScale(24);
const SupportAndFeedbackSheet = (props: SheetProps<"support-and-feedback">) => {
  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(24) }}>
        <ActionSheetButton
          leftIcon={<SuggestionIcon width={_iconSize} height={_iconSize} />}
          buttonName={"Suggestion Box"}
          labelStyle={styles.textStyle}
        />
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
