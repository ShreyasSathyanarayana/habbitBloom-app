import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import ActionSheet, {
  ActionSheetProps,
  ActionSheetRef,
} from "react-native-actions-sheet";
type Props = {
  sheetId: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
} & ActionSheetProps;

const ActionSheetContainer1 = ({
  sheetId,
  children,
  containerStyle,
  ...rest
}: Props) => {
  return (
    <View>
      <ActionSheet
        {...rest}
        id={sheetId}
        containerStyle={StyleSheet.flatten([
          {
            backgroundColor: "black", // Fix for Android transparency issue
            paddingBottom: horizontalScale(16),
            paddingHorizontal: horizontalScale(16),
            //   paddingVertical: verticalScale(24),
          },
          containerStyle,
        ])}
        indicatorStyle={{
          backgroundColor: "white",
          marginTop: verticalScale(16),
          width: horizontalScale(80),
          marginBottom: verticalScale(24),
        }}
        gestureEnabled={true}
      >
        {children}
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ActionSheetContainer1;
