import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import ActionSheet, { ActionSheetProps } from "react-native-actions-sheet";
type Props = {
  sheetId: string;
  children: React.ReactNode;
} & ActionSheetProps;

const ActionSheetContainer = ({ sheetId, ...props }: Props) => {
  return (
    <View key={sheetId}>
      <ActionSheet
        {...props}
        id={sheetId}
        containerStyle={{
          backgroundColor: "rgba(28, 28, 30, 1)", // Fix for Android transparency issue
          paddingBottom: horizontalScale(16),
          paddingHorizontal: horizontalScale(16),
          //   paddingVertical: verticalScale(24),
        }}
        indicatorStyle={{
          backgroundColor: "white",
          // marginTop: verticalScale(16),
          width: 0,
          // marginBottom: verticalScale(24),
        }}
        gestureEnabled={true}
      >
        {props.children}
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ActionSheetContainer;
