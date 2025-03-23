import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import CancelIcon from "@/assets/svg/cancel-icon.svg";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { Pressable } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
type Props = {
  title: string;
  onClose: () => void;
};

const _iconSize = horizontalScale(24);

const SheetHeader = ({ title, onClose }: Props) => {
  return (
    <View style={styles.container}>
      <ThemedText
        style={{ fontSize: getFontSize(20), fontFamily: "PoppinsSemiBold" }}
      >
        {title}
      </ThemedText>
      <Pressable onPress={onClose}>
        <CancelIcon width={_iconSize} height={_iconSize} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SheetHeader;
