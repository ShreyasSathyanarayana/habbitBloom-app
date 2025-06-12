import { PostWithDetails, toggleLikePost } from "@/api/api";
import React from "react";
import { StyleSheet, View } from "react-native";

import PostHeader from "./post-header";
import { ThemedText } from "@/components/ui/theme-text";
import { verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import PostImages from "./post-images";
import PostFooter from "./post-footer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { SheetManager } from "react-native-actions-sheet";
import ExpandableText from "./expandable-text";

const PostCard = ({
  content,
  created_at,
  habit_id,
  image_urls,
  id,
  likeCount,
  user,
  user_id,
  latestComment,
  commentCount,
  likedByCurrentUser,
  comment_enable,
  habit_name,
  reward_post,
}: PostWithDetails) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const toggleLikeMutation = useMutation({
    mutationKey: ["toggleLike"],
    mutationFn: () => toggleLikePost(id),
    onSuccess: (result) => {
      // Update the specific post in the infinite query
      queryClient.setQueryData(["my-posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.map((post) => {
              if (post.id !== id) return post;

              return {
                ...post,
                likeCount:
                  result === "liked" ? post.likeCount + 1 : post.likeCount - 1,
                likedByCurrentUser: result === "liked",
              };
            })
          ),
        };
      });
      queryClient.setQueryData(["all-posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.map((post) => {
              if (post.id !== id) return post;

              return {
                ...post,
                likeCount:
                  result === "liked" ? post.likeCount + 1 : post.likeCount - 1,
                likedByCurrentUser: result === "liked",
              };
            })
          ),
        };
      });
    },
    onError: () => {
      console.log("post like updated failed");
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });

  return (
    <View style={styles.container}>
      <PostHeader
        uri={user?.profile_pic}
        userName={user?.full_name}
        created_at={created_at}
        onClickThreeDot={() =>
          SheetManager.show("post-more-option", {
            payload: {
              postDetails: {
                content,
                created_at,
                habit_id,
                image_urls,
                reward_post,
                id,
                likeCount,
                user,
                user_id,
                latestComment,
                commentCount,
                likedByCurrentUser,
                comment_enable,
                habit_name,
              },
            },
          })
        }
      />
      {/* <ThemedText style={{ fontSize: getFontSize(14) }}>{content}</ThemedText> */}
      <ExpandableText
        content={content}
        textStyle={{ fontSize: getFontSize(12) }}
      />
      {habit_name && (
        <ThemedText
          style={{
            fontSize: getFontSize(12),
            color: "rgba(138, 43, 226, 1)",
            fontFamily: "PoppinsMedium",
          }}
        >
          #{habit_name}
        </ThemedText>
      )}
      <PostImages images={image_urls ?? []} rewardPost={reward_post} />
      <PostFooter
        likeCount={likeCount}
        commentCount={commentCount}
        onClickComment={() => console.log("comment")}
        onClickLike={() => toggleLikeMutation.mutateAsync()}
        onClickShare={() => console.log("share")}
        likedByCurrentUser={likedByCurrentUser}
        commentEnable={comment_enable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
  },
});

export default PostCard;
