import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LikeIcon from "@/assets/svg/like-icon.svg";
import CommentIcon from "@/assets/svg/comment-icon.svg";
import ShareIcon from "@/assets/svg/post-share-icon.svg";
import HideCommentIcon from "@/assets/svg/hide-comment-icon.svg";
import { horizontalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { formatLikeCount } from "@/utils/constants";
import { getFontSize } from "@/font";
import LikeButton from "@/components/ui/like-button";

const _iconSize = horizontalScale(24);
const _hideCommentSize = horizontalScale(20);

type Props = {
  likeCount: number;
  commentCount: number;
  onClickLike: () => void;
  onClickComment: () => void;
  onClickShare: () => void;
  likedByCurrentUser: boolean;
  commentEnable: boolean;
};

const PostFooter = ({
  likeCount,
  commentCount,
  onClickComment,
  onClickLike,
  onClickShare,
  likedByCurrentUser,
  commentEnable,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* <TouchableOpacity style={styles.btnStyle} onPress={onClickLike}>
          <LikeIcon width={_iconSize} height={_iconSize} />
          <ThemedText style={styles.countTextStyle}>
            {formatLikeCount(likeCount ?? 0)}
          </ThemedText>
        </TouchableOpacity> */}
        <View style={styles.btnStyle}>
          <LikeButton isLiked={likedByCurrentUser} onClick={onClickLike} />
          <ThemedText style={styles.countTextStyle}>
            {formatLikeCount(likeCount ?? 0)}
          </ThemedText>
        </View>
        <TouchableOpacity
          disabled={!commentEnable}
          style={styles.btnStyle}
          onPress={onClickComment}
        >
          {commentEnable && (
            <>
              <CommentIcon width={_iconSize} height={_iconSize} />
              <ThemedText style={styles.countTextStyle}>
                {formatLikeCount(commentCount ?? 0)}
              </ThemedText>
            </>
          )}
          {!commentEnable && (
            <HideCommentIcon
              width={_hideCommentSize}
              height={_hideCommentSize}
              style={{ opacity: 0.7 }}
            />
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.btnStyle} onPress={onClickShare}>
        <ShareIcon width={_iconSize} height={_iconSize} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(16),
  },
  btnStyle: {
    flexDirection: "row",
    gap: horizontalScale(8),
    alignItems: "center",
  },
  countTextStyle: {
    fontSize: getFontSize(14),
  },
});

export default PostFooter;
