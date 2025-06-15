import React, { useState, useCallback, useMemo } from "react";
import { Dimensions, Keyboard, Platform, StyleSheet, View } from "react-native";
import { SheetProps, FlatList } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton"; // Import Skeleton from moti/skeleton

import {
  postComment,
  toggleCommentLike,
  getUserProfile,
  deleteCommentById,
} from "@/api/api";
import CommentItem from "@/components/module/comment-section/comment-item";
import CommentInput from "@/components/module/insights/comment-input";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { useComments } from "@/components/module/insights/useComments";

const windowHeight = Dimensions.get("window").height;

const CommentPostSheet = (props: SheetProps<"comment-post">) => {
  const { payload } = props;
  const toast = useToast();
  const queryClient = useQueryClient();

  const [commentContent, setCommentContent] = useState("");
  const [parentCommentId, setParentCommentId] = useState<string | null>(null);
  const [parentCommentUserName, setParentCommentUserName] = useState("");

  const postId = payload?.postId ?? "";

  // Fetch comments using the custom hook
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useComments(postId); // isLoading here indicates the *initial* fetch

  // Fetch user details
  const { data: userDetails, isLoading: isUserDetailsLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserProfile,
    staleTime: Infinity,
  });

  const allComments = useMemo(() => data?.pages?.flat() || [], [data]);

  // Mutation for submitting a new comment
  const submitCommentMutation = useMutation({
    mutationFn: () =>
      postComment({
        postId,
        content: commentContent,
        parentCommentId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", postId],
        refetchType: "active",
      });

      queryClient.setQueryData(["all-posts"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  commentCount: (post.commentCount || 0) + 1,
                };
              }
              return post;
            })
          ),
        };
      });

      setCommentContent("");
      setParentCommentId(null);
      setParentCommentUserName("");
      Keyboard.dismiss();
    },
    onError: () => {
      toast.show("Failed to submit comment. Please try again.", {
        type: "warning",
      });
    },
  });

  // Mutation for toggling comment likes
  const toggleCommentLikeMutation = useMutation({
    mutationFn: (commentId: string) => toggleCommentLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
    onError: () => {
      toast.show("Failed to like/unlike comment. Please try again.", {
        type: "warning",
      });
    },
  });

  const handleReplyPress = useCallback((parentId: string, userName: string) => {
    setParentCommentId(parentId);
    setParentCommentUserName(userName);
  }, []);

  const handleLikeToggle = useCallback(
    (commentId: string) => {
      toggleCommentLikeMutation.mutate(commentId);
    },
    [toggleCommentLikeMutation]
  );

  const handleCancelReply = useCallback(() => {
    setParentCommentId(null);
    setParentCommentUserName("");
  }, []);

  const renderCommentItem = useCallback(
    ({ item }: { item: any }) => (
      <CommentItem
        comment={item}
        isLastChild={false}
        onReplyPress={handleReplyPress}
        onLikeToggle={handleLikeToggle}
        level={0}
        postId={payload?.postId ?? ""}
        // deleteCommentLoading={commentDeleteMutation.isPending}
        // onDeleteComment={(commentId) =>
        //   commentDeleteMutation.mutateAsync(commentId)
        // }
      />
    ),
    [handleReplyPress, handleLikeToggle]
  );

  // --- Loading Skeletons for Initial Load ---
  const renderLoadingSkeletons = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(2)].map(
        (
          _,
          index // Render 5 skeleton items
        ) => (
          <Skeleton.Group key={index} show={true}>
            <View style={styles.skeletonItem}>
              <Skeleton width={40} height={40} radius={"round"} />
              <View style={styles.skeletonTextContainer}>
                <Skeleton width={"70%"} height={12} radius={4} />
                <Skeleton
                  width={"90%"}
                  height={10}
                  radius={4}
                  // style={{ marginTop: 8 }}
                />
                <Skeleton
                  width={"40%"}
                  height={10}
                  radius={4}
                  // style={{ marginTop: 4 }}
                />
              </View>
            </View>
          </Skeleton.Group>
        )
      )}
    </View>
  );

  return (
    <ActionSheetContainer1
      sheetId={props.sheetId}
      containerStyle={styles.actionSheetContainer}
    >
      {/* Conditional rendering for initial loading state */}
      {isLoading ? (
        renderLoadingSkeletons()
      ) : (
        <>
          {allComments.length === 0 && (
            <ThemedText style={styles.noCommentsText}>
              Be the first one to comment
            </ThemedText>
          )}

          <FlatList
            data={allComments}
            contentContainerStyle={styles.flatListContent}
            ItemSeparatorComponent={() => (
              <View style={styles.commentSeparator} />
            )}
            renderItem={renderCommentItem}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            keyExtractor={(item) => item.id}
            // Show loading indicator for more comments
            ListFooterComponent={
              isFetchingNextPage ? <LoadingMoreIndicator /> : null
            }
          />
        </>
      )}

      {/* Comment input section */}
      <CommentInput
        value={commentContent}
        onChangeText={setCommentContent}
        onSubmit={submitCommentMutation.mutateAsync}
        userImage={userDetails?.profile_pic ?? ""}
        isLoading={submitCommentMutation.isPending || isUserDetailsLoading} // Also consider user details loading
        onCancelParentId={handleCancelReply}
        parentId={parentCommentId}
        parentUserName={parentCommentUserName}
      />
    </ActionSheetContainer1>
  );
};

// Simple loading indicator component for pagination
const LoadingMoreIndicator = () => (
  <View style={styles.loadingContainer}>
    <ThemedText style={styles.loadingText}>Loading more comments...</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  actionSheetContainer: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    justifyContent: "space-between",
    backgroundColor: "rgba(28, 28, 30, 1)",
    maxHeight: windowHeight * 0.8,
  },
  noCommentsText: {
    textAlign: "center",
    color: "rgba(142, 142, 147, 1)",
    fontSize: getFontSize(13),
    paddingVertical: horizontalScale(20),
  },
  flatListContent: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: horizontalScale(16),
  },
  commentSeparator: {
    height: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    color: "rgba(138, 43, 226, 1)",
    fontSize: getFontSize(12),
  },
  // --- Styles for Skeletons ---
  skeletonContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: horizontalScale(16),
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16, // Spacing between skeleton items
  },
  skeletonTextContainer: {
    marginLeft: 10,
    flex: 1, // Take remaining space
    gap: verticalScale(8),
  },
});

export default CommentPostSheet;
