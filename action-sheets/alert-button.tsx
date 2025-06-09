import Button from "@/components/ui/button";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
type Props = {
  firstBtnLabel: string;
  secondBtnLabel: string;
  firstBtnAction: () => void;
  secondBtnAction: () => void;
  secondBtnLoading?: boolean;
  firstBtnLoading?: boolean;
  style?: ViewStyle;
  secondLabelStyle?: StyleProp<ViewStyle>;
};
const AlertButton = ({
  firstBtnAction,
  firstBtnLabel,
  secondBtnAction,
  secondBtnLabel,
  secondBtnLoading = false,
  firstBtnLoading = false,
  style,
  secondLabelStyle,
}: Props) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(8),
          paddingBottom: verticalScale(16),
        },
        style,
      ]}
    >
      <Button
        disabled={firstBtnLoading}
        isLoading={firstBtnLoading}
        style={{ flex: 1 }}
        outline
        labelStyle={{ color: "white" }}
        label={firstBtnLabel}
        onPress={firstBtnAction}
      />
      <Button
        disabled={secondBtnLoading}
        isLoading={secondBtnLoading}
        label={secondBtnLabel}
        onPress={secondBtnAction}
        style={[{ flex: 1 }, secondLabelStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default AlertButton;
