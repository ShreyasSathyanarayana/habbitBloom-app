import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import ActionSheetContainer from "@/components/ui/action-sheet-container";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import ViewProfileIcon from "@/assets/svg/view-profile-icon.svg";
import ReportIcon from "@/assets/svg/report-icon.svg";
import HideCommentIcon from "@/assets/svg/hide-comment-icon.svg";
import CommentIcon from "@/assets/svg/comment-icon copy.svg";
import ReportRightArrow from "@/assets/svg/report-right-arrow.svg";
import DeletePostIcon from "@/assets/svg/delete-post-icon.svg";
import EditPostIcon from "@/assets/svg/edit-post-icon.svg";
import { getUserId } from "@/utils/persist-storage";
import { reportList } from "@/utils/constants";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCommentEnabled } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
import { usePostStore } from "@/store/post-store";

const _iconSize = horizontalScale(20);

const closeSheet = () => {
  SheetManager.hide("post-more-option");
};

const MoreOptionSheet = (props: SheetProps<"post-more-option">) => {
  const payload = props?.payload?.postDetails;
  const userId = getUserId();
  const isMyPost = payload?.user_id == userId;
  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      {!isMyPost && <OtherUserView userId={payload?.user_id ?? ""} />}
      {isMyPost && (
        <CurrentUseView
          postId={payload?.id ?? ""}
          commentEnable={payload?.comment_enable ?? false}
          description={payload?.content ?? ""}
          habitId={payload?.habit_id ?? null}
          images={payload?.image_urls ?? []}
          habitName={payload?.habit_name ?? ""}
          reward_post={payload?.reward_post ?? false}
        />
      )}
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default MoreOptionSheet;

type OtherUserViewProp = {
  userId: string;
};

const OtherUserView = ({ userId }: OtherUserViewProp) => {
  const [reportScreenOpen, setReportScreenOpen] = useState(false);

  const handleReportItem = (reportName: string) => {
    setReportScreenOpen(false);
    SheetManager.hide("post-more-option");
    router.push("/(protected)/create-post/report-completed-screen");
  };

  const handleProfileView = () => {
    closeSheet();
    router.push({
      pathname: "/(protected)/other-user-view",
      params: { userId: userId },
    });
  };

  return (
    <View style={{ gap: verticalScale(24) }}>
      {!reportScreenOpen && (
        <>
          <ActionSheetButton
            leftIcon={<ViewProfileIcon width={_iconSize} height={_iconSize} />}
            buttonName={"View Profile"}
            onPress={handleProfileView}
          />
          <ActionSheetButton
            leftIcon={<ReportIcon width={_iconSize} height={_iconSize} />}
            buttonName={"Report Post"}
            labelStyle={{ color: "rgba(255, 59, 48, 1)" }}
            onPress={() => setReportScreenOpen(true)}
          />
        </>
      )}
      {reportScreenOpen && (
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={reportList}
          ListHeaderComponent={() => (
            <ThemedText
              style={{
                textAlign: "center",
                fontFamily: "PoppinsSemiBold",
                marginBottom: verticalScale(20),
              }}
            >
              Report
            </ThemedText>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          renderItem={({ item }) => (
            <ReportItem name={item} onPress={() => handleReportItem(item)} />
          )}
        />
      )}
    </View>
  );
};

type CurrentUserProps = {
  postId: string;
  commentEnable: boolean;
  description: string;
  images: string[];
  habitId: string | null;
  habitName: string;
  reward_post: boolean;
};

const CurrentUseView = ({
  postId,
  commentEnable,
  description,
  images,
  habitId,
  habitName,
  reward_post,
}: CurrentUserProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { updatePostForm } = usePostStore();
  const setCommentEnableMutation = useMutation({
    mutationKey: ["setCommentEnable"],
    mutationFn: () => setCommentEnabled(postId, commentEnable),
    onSuccess: () => {
      // Update the cached data manually
      closeSheet();
      queryClient.setQueryData(["all-posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.map((post) =>
              post.id === postId
                ? { ...post, comment_enable: !commentEnable }
                : post
            )
          ),
        };
      });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });

  const handleEditPost = () => {
    updatePostForm({
      description,
      images,
      habitId,
      editMode: true,
      postId,
      habitName,
      rewardPostMode: reward_post,
    });
    closeSheet();
    router.push("/(protected)/create-post");
  };

  return (
    <View style={{ gap: verticalScale(24) }}>
      <ActionSheetButton
        leftIcon={
          commentEnable ? (
            <HideCommentIcon width={_iconSize} height={_iconSize} />
          ) : (
            <CommentIcon width={_iconSize} height={_iconSize} />
          )
        }
        buttonName={commentEnable ? "Turn off comments" : "Turn on comments"}
        onPress={() => setCommentEnableMutation.mutateAsync()}
        isLoading={setCommentEnableMutation.isPending}
      />
      <ActionSheetButton
        onPress={handleEditPost}
        leftIcon={<EditPostIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Edit post"}
      />
      <ActionSheetButton
        leftIcon={<DeletePostIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Delete post"}
        labelStyle={{ color: "rgba(255, 59, 48, 1)" }}
        onPress={() =>
          SheetManager.show("delete-post", { payload: { postId: postId } })
        }
      />
    </View>
  );
};

const ReportItem = ({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.reportContainer}>
      <ThemedText>{name}</ThemedText>
      <ReportRightArrow width={_iconSize} height={_iconSize} />
    </TouchableOpacity>
  );
};
