import SheetHeader from "@/action-sheets/sheet-header";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/theme-text";
import { getFontSize } from "@/font";
import AlertButton from "@/action-sheets/alert-button";
import { openAppSettings } from "@/utils/permission";
import { usePostStore } from "@/store/post-store";
import { router } from "expo-router";
type Props = {
  isModalVisible: boolean;
  onClose: () => void;
};

const ExitPermissionModal = ({ isModalVisible, onClose }: Props) => {
  const { resetForm } = usePostStore();

  return (
    <Modal
      onRequestClose={onClose}
      visible={isModalVisible}
      style={{ flex: 1 }}
      animationType="fade"
      transparent
    >
      <View style={ModalStyles.container}>
        <View style={ModalStyles.modalContainer}>
          <SheetHeader title="Discard changes?" onClose={onClose} />
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            To give you the best experience, we need access to your . You can
            enable it in settings anytime.
          </ThemedText>
          <AlertButton
            firstBtnLabel="Don't leave"
            secondBtnLabel="Discard"
            firstBtnAction={onClose}
            secondBtnAction={() => {
              resetForm();
              onClose();
              router.back();
            }}
            style={{ paddingBottom: 0 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export const ModalStyles = StyleSheet.create({
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

export default ExitPermissionModal;
