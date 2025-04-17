import SheetHeader from "@/action-sheets/sheet-header";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/theme-text";
import { getFontSize } from "@/font";
import AlertButton from "@/action-sheets/alert-button";
import { openAppSettings } from "@/utils/permission";
type Props = {
  isModalVisible: boolean;
  permissionType: string;
  onClose: () => void;
};

const AllowPermissionModal = ({
  isModalVisible,
  permissionType,
  onClose,
}: Props) => {
  return (
    <Modal
      onRequestClose={onClose}
      visible={isModalVisible}
      style={{ flex: 1 }}
      transparent
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <SheetHeader title="Allow Permission" onClose={onClose} />
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            To give you the best experience, we need access to your
            <ThemedText style={{ color: "rgba(138, 43, 226, 1)" }}>
              {" "}{permissionType}
            </ThemedText>
            . You can enable it in settings anytime.
          </ThemedText>
          <AlertButton
            firstBtnLabel="Cancel"
            secondBtnLabel="Settings"
            firstBtnAction={onClose}
            secondBtnAction={openAppSettings}
            style={{ paddingBottom: 0 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: horizontalScale(16),
  },
  modalContainer: {
    backgroundColor: "rgba(28, 28, 30, 1)",
    borderRadius: horizontalScale(16),
    padding: horizontalScale(24),
    gap: verticalScale(24),
  },
});

export default AllowPermissionModal;
