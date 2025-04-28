import ActionSheetContainer from "@/components/ui/action-sheet-container";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import SheetHeader from "../sheet-header";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { ThemedText } from "@/components/ui/theme-text";
import Button from "@/components/ui/button";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import RewardIcon from "@/components/module/analytics-screen/rewards/reward-icon";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import ConfettieIcon from "@/assets/svg/confettie.svg";
const onclose = () => {
  SheetManager.hide("reward-sheet");
};

const _rewardWidth = horizontalScale(150);
const _rewardHeight = horizontalScale(200);
const _circleWidth = horizontalScale(190);

const RewardSheet = (props: SheetProps<"reward-sheet">) => {
  const payload = props.payload;
  

  const componentRef = useRef<ViewShot | null>(null);

  const onShare = async () => {
    const uri = await captureRef(componentRef, {
      result: "tmpfile",
      format: "png",
    });

    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <SheetHeader title="You’ve Earned This!" onClose={onclose} />
      <View style={{ gap: verticalScale(16), paddingTop: verticalScale(16) }}>
        <ViewShot
          ref={componentRef}
          options={{
            format: "png",
            quality: 1,
            fileName: `${payload?.habitName}.png`,
          }}
        >
          <View style={styles.rewardContainer}>
            <ConfettieIcon style={styles.confeetieStyle} />
            <View style={{ alignItems: "center" }}>
              <RewardIcon
                style={{
                  width: _rewardWidth,
                  height: _rewardHeight,
                  zIndex: 2,
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
        </ViewShot>
        <Button label="Share" onPress={onShare} />
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
    backgroundColor: "rgba(28, 28, 30, 1)",
    padding: horizontalScale(16),
    // flex: 1,
  },
  backgroundCircle: {
    width: _circleWidth,
    height: _circleWidth,
    borderRadius: _circleWidth,
    backgroundColor: "rgba(138, 43, 226, 1)",
    position: "absolute",
    zIndex: 0,
    // top: verticalScale(8),
  },
  confeetieStyle: {
    position: "absolute",
    zIndex: 1,
    top: verticalScale(10),
  },
});

export default RewardSheet;
