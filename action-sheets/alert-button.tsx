import Button from "@/components/ui/button";
import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  firstBtnLabel: string;
  secondBtnLabel: string;
  firstBtnAction: () => void;
  secondBtnAction: () => void;
};
const AlertButton = ({
  firstBtnAction,
  firstBtnLabel,
  secondBtnAction,
  secondBtnLabel,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: horizontalScale(8),
      }}
    >
      <Button
        style={{ flex: 1 }}
        outline
        label={firstBtnLabel}
        onPress={firstBtnAction}
      />
      <Button
        label={secondBtnLabel}
        onPress={secondBtnAction}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default AlertButton;
