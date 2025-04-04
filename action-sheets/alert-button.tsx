import Button from "@/components/ui/button";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  firstBtnLabel: string;
  secondBtnLabel: string;
  firstBtnAction: () => void;
  secondBtnAction: () => void;
  secondBtnLoading?: boolean;
  firstBtnLoading?: boolean;
};
const AlertButton = ({
  firstBtnAction,
  firstBtnLabel,
  secondBtnAction,
  secondBtnLabel,
  secondBtnLoading = false,
  firstBtnLoading = false,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: horizontalScale(8),
        paddingBottom: verticalScale(16),
      }}
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
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default AlertButton;
