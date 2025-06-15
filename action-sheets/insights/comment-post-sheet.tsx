import {
  getPaginatedNestedComments,
  getUserProfile,
  postComment,
  PostCommentDetails,
  toggleCommentLike,
} from "@/api/api";
import CommentItem from "@/components/module/comment-section/comment-item";
import CommentInput from "@/components/module/insights/comment-input";
// import { useComments } from "@/components/module/insights/useComments";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SheetProps, FlatList } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";

const windowHeight = Dimensions.get("window").height;

const PAGE_SIZE = 10;

const CommentPostSheet = (props: SheetProps<"comment-post">) => {
  const payload = props?.payload;
  const toast = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = React.useState("");
  const [parenId, setParentId] = React.useState<string | null>(null);
  const [parentCommentUserName, setParentCommentUserName] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PostCommentDetails[], Error>({
      queryKey: ["comments", payload?.postId], // Assumes postId doesn't change often
      queryFn: ({ pageParam = 1 }) =>
        getPaginatedNestedComments(payload?.postId ?? "", pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // If the last page has less than PAGE_SIZE, no more pages
        if (lastPage.length < PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
    });

  const getUserDetailsQuery = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => {
      return getUserProfile();
    },
    networkMode: "online",
  });
  // console.log("data==>", JSON.stringify(data?.pages?.flat(), null, 2));

  const submitCommentMutation = useMutation({
    mutationKey: ["submitComment"],
    mutationFn: () =>
      postComment({
        postId: payload?.postId ?? "",
        content: comment,
        parentCommentId: parenId,
      }),
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
    onSuccess: async () => {
      console.log("Successfully completed");
      // toast.show("Comment submitted successfully", {
      //   type: "success",
      // });

      await queryClient.invalidateQueries({
        queryKey: ["comments", payload?.postId],
        refetchType: "active", // ensures it's refetched if mounted
      });
      queryClient.setQueryData(["all-posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.map((post) => {
              if (post.id === payload?.postId) {
                return {
                  ...post,
                  commentCount: (post.commentCount || 0) + 1, // or -1 for delete
                };
              }
              return post;
            })
          ),
        };
      });

      setComment("");
      setParentId(null);
      setParentCommentUserName("");
      Keyboard.dismiss();
    },
  });

  const toggleCommentLikeMutation = useMutation({
    mutationKey: ["commentLike"],
    mutationFn: (commentId: string) => toggleCommentLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: () => {
      toast.show("Something went Wrong", {
        type: "warning",
      });
    },
  });

  const handleCancelReply = () => {
    setParentId(null);
    setParentCommentUserName("");
  };

  return (
    <ActionSheetContainer1
      sheetId={props.sheetId}
      // snapPoints={[windowHeight * 0.8, windowHeight * 0.9]}
      // initialSnapIndex={0}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
        // height: "80%",
        justifyContent: "space-between",
        backgroundColor: "rgba(28, 28, 30, 1)",
        maxHeight: windowHeight * 0.8,
      }}
    >
      {data?.pages?.flat()?.length === 0 && (
        <ThemedText
          style={{
            textAlign: "center",
            color: "rgba(142, 142, 147, 1)",
            fontSize: getFontSize(13),
          }}
        >
          Be the first one to comment
        </ThemedText>
      )}

      <FlatList
        // itemLayoutAnimation={SequencedTransition}
        data={data?.pages?.flat()}
        contentContainerStyle={{
          paddingHorizontal: horizontalScale(16),
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <Skeleton show={isLoading}>
            <CommentItem
              comment={item}
              isLastChild={false}
              onReplyPress={function (
                parentId: string,
                userName: string
              ): void {
                setParentId(parentId);
                setParentCommentUserName(userName);
              }}
              onLikeToggle={function (
                commentId: string,
                currentLikedStatus: boolean
              ): void {
                toggleCommentLikeMutation.mutateAsync(commentId);
              }}
              level={0}
            />
          </Skeleton>
        )}
        onEndReached={() => fetchNextPage()}
      />

      <CommentInput
        value={comment}
        onChangeText={(text) => setComment(text)}
        onSubmit={() => submitCommentMutation?.mutateAsync()}
        userImage={getUserDetailsQuery?.data?.profile_pic ?? ""}
        isLoading={submitCommentMutation?.isPending}
        onCancelParentId={handleCancelReply}
        parentId={parenId}
        parentUserName={parentCommentUserName}
      />
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default CommentPostSheet;
