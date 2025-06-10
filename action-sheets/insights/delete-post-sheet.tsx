import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import ActionSheetContainer from "@/components/ui/action-sheet-container";
import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import SheetHeader from "../sheet-header";
import { verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import AlertButton from "../alert-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
const closeSheet = () => {
  SheetManager.hide("delete-post");
  
};

const DeletePostSheet = (props: SheetProps<"delete-post">) => {
  const payload = props?.payload;
  const queryClient = useQueryClient();
  const toast = useToast();
  const deleteMutation = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: () => deletePost(payload?.postId ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.setQueryData(["all-posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.filter((post) => post.id !== payload?.postId)
          ),
        };
      });
      closeSheet();
      SheetManager.hide("post-more-option");
      toast.show("Post Deleted Successfully", {
        type: "success",
      });
    },
    onError: () => {
      closeSheet();
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });
  return (
    <ActionSheetContainer sheetId={props.sheetId}>
      <SheetHeader title="Delete Post?" onClose={closeSheet} />
      <View style={styles.container}>
        <ThemedText style={{ fontSize: getFontSize(14) }}>
          Are you sure you want to delete this post? This action can’t be
          undone.
        </ThemedText>
        <AlertButton
          firstBtnLabel="Cancel"
          secondBtnLabel="Delete"
          firstBtnAction={closeSheet}
          secondBtnAction={() => deleteMutation.mutateAsync()}
          secondLabelStyle={{
            backgroundColor: "rgba(255, 59, 48, 1)",
            borderColor: "rgba(255, 59, 48, 1)",
          }}
          secondBtnLoading={deleteMutation.isPending}
        />
      </View>
    </ActionSheetContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
    gap: verticalScale(24),
  },
});

export default DeletePostSheet;
