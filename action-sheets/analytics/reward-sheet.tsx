import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import SheetHeader from "../sheet-header";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { ThemedText } from "@/components/ui/theme-text";
import Button from "@/components/ui/button";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import RewardIcon from "@/components/module/analytics-screen/rewards/reward-icon";
const onclose = () => {
  SheetManager.hide("reward-sheet");
};

const RewardSheet = (props: SheetProps<"reward-sheet">) => {
  const payload = props.payload;
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <SheetHeader title="You’ve Earned This!" onClose={onclose} />
      <View style={{ gap: verticalScale(16), paddingTop: verticalScale(16) }}>
        <View style={styles.rewardContainer}>
          <View style={{ alignItems: "center" }}>
            <RewardIcon
              style={{
                width: horizontalScale(90),
                height: horizontalScale(120),
                zIndex: 1,
              }}
              imageUri={payload?.rewardUri ?? ""}
            />
            <View style={styles.backgroundCircle} />
          </View>
          <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
            {payload?.habitName}
          </ThemedText>
          <ThemedText style={[styles.textStyle, { textAlign: "center" }]}>
            Completed a streak day!
          </ThemedText>
          <ThemedText style={[styles.textStyle, { textAlign: "center" }]}>
            Small steps every day lead to big changes
          </ThemedText>
        </View>
        <Button label="Share" onPress={onclose} />
      </View>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: getFontSize(14),
  },
  rewardContainer: {
    alignItems: "center",
    gap: verticalScale(16),
    // flex: 1,
  },
  backgroundCircle: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    borderRadius: horizontalScale(50),
    backgroundColor: "rgba(138, 43, 226, 1)",
    position: "absolute",
    zIndex: 0,
    top: verticalScale(8),
  },
});

export default RewardSheet;
