import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import LottieView from "lottie-react-native";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import Button from "@/components/ui/button";

const _iconSize = horizontalScale(150);
const closeSheet = () => {
  SheetManager.hide("marked-habit");
};

const MarkedHabitSheet = (props: SheetProps<"marked-habit">) => {
  const animation = useRef<LottieView>(null);
  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: _iconSize,
              height: _iconSize,
              backgroundColor: "transparent",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("@/assets/lottie/lottie-animation1.json")}
          />
        </View>
        <ThemedText style={{ fontSize: getFontSize(14), textAlign: "center" }}>
          Nice job! You’re keeping the streak alive. Stay on track!
        </ThemedText>
        <Button label="Done" onPress={closeSheet} />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(18),
  },
});

export default MarkedHabitSheet;
