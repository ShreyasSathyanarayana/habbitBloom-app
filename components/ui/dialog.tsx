import { horizontalScale } from "@/metric";
import React from "react";
import { Modal, ModalProps, StyleSheet, View } from "react-native";
import { ThemedText } from "./theme-text";
import SheetHeader from "@/action-sheets/sheet-header";
import Button from "./button";
type Props = {
  title: string;
  onClose: () => void;
} & ModalProps;

const Dialog = ({ title, onClose, style, ...rest }: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      //   style={[styles.container, style]}
      {...rest}
    >
      <View style={styles.container}>
        <View style={styles.dialogBox}>
          <SheetHeader title={title} onClose={onClose} />
          <View style={{ flexDirection: "row", gap: horizontalScale(12) }}>
            <Button outline label="Delete" />
            <Button label="Delete" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    paddingHorizontal: horizontalScale(10),
    justifyContent: "center",
  },
  dialogBox: {
    backgroundColor: "rgba(28, 28, 30, 1)",
    padding: horizontalScale(24),
    borderRadius: horizontalScale(12),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default Dialog;
