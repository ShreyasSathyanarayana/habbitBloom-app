import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Svg, { Path } from "react-native-svg";
import moment from "moment";
import { PostCommentDetails } from "@/api/api";
import CommentAvatar from "../insights/comment-avatar";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import ExpandableText from "../insights/expandable-text";
import { getFontSize } from "@/font";

interface CommentProps {
  comment: PostCommentDetails;
  isLastChild: boolean;
  hasMoreReplies?: boolean;
  onReplyPress: (parentId: string, userName: string) => void;
  onViewMoreRepliesPress?: (parentId: string) => void;
  onLikeToggle: (commentId: string, currentLikedStatus: boolean) => void;
  level: number;
}

const LINE_INDENT = horizontalScale(20);
const AVATAR_SIZE = horizontalScale(28);
const ICON_SIZE = horizontalScale(14);

const CommentItem: React.FC<CommentProps> = ({
  comment,
  isLastChild,
  hasMoreReplies = false,
  onReplyPress,
  onViewMoreRepliesPress,
  onLikeToggle,
  level,
}) => {
  const {
    id,
    full_name,
    content,
    created_at,
    profile_pic,
    like_count,
    liked_by_me,
    children,
  } = comment;

  const [likeCount, setLikeCount] = useState(like_count);
  const [liked, setLiked] = useState(liked_by_me);

  const hasChildren = children && children.length > 0;
  const marginLeft = level * horizontalScale(35);
  const timeAgo = moment.utc(created_at).local().fromNow();

  const handleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount(nextLiked ? likeCount + 1 : likeCount - 1);
    onLikeToggle(id, nextLiked);
  };

  const renderLine = () => (
    <Svg height="100%" width={LINE_INDENT} style={styles.svgLineContainer}>
      <Path
        d={`M${LINE_INDENT / 2},0 V${AVATAR_SIZE + 4} Q${LINE_INDENT / 2},${
          AVATAR_SIZE + 10
        } ${LINE_INDENT / 2 + 5},${AVATAR_SIZE + 10} H${LINE_INDENT}`}
        stroke="#555"
        strokeWidth="1"
        fill="none"
      />
    </Svg>
  );

  return (
    <View style={styles.outerContainer}>
      {level > 0 && (
        <View style={styles.lineWrapper}>
          {renderLine()}
          {!isLastChild && <View style={styles.lineTail} />}
        </View>
      )}

      <View style={[styles.row, { marginLeft }]}>
        <CommentAvatar
          uri={profile_pic || ""}
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        />

        <View style={styles.contentArea}>
          <View style={styles.headerRow}>
            <ThemedText numberOfLines={1} style={styles.author}>
              {full_name}
            </ThemedText>
            <ThemedText style={styles.timestamp}>{timeAgo}</ThemedText>
          </View>
          <ExpandableText
            content={content}
            textStyle={{ fontSize: getFontSize(10) }}
          />
          {level === 0 && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => onReplyPress(id, full_name)}
                style={styles.actionBtn}
              >
                <Icon name="reply" size={ICON_SIZE} color="#888" />
                <ThemedText style={styles.actionText}>Reply</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={handleLike}
          style={[
            styles.actionBtn,
            { flexDirection: "column", alignItems: "center" },
          ]}
        >
          <Icon
            name={liked ? "heart" : "heart-outline"}
            size={ICON_SIZE}
            color={liked ? "#E91E63" : "#888"}
          />
          <ThemedText
            style={[
              styles.actionText,
              liked && { color: "#E91E63" },
              { marginLeft: 0 },
            ]}
          >
            {likeCount}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {hasChildren && (
        <View style={styles.childrenContainer}>
          {children.map((child, index) => (
            <CommentItem
              key={child.id}
              comment={child}
              isLastChild={index === children.length - 1}
              hasMoreReplies={index === children.length - 1 && hasMoreReplies}
              onReplyPress={onReplyPress}
              onViewMoreRepliesPress={onViewMoreRepliesPress}
              onLikeToggle={onLikeToggle}
              level={level + 1}
            />
          ))}
          {hasMoreReplies && (
            <TouchableOpacity
              onPress={() => onViewMoreRepliesPress?.(id)}
              style={[
                styles.viewMoreBtn,
                { marginLeft: marginLeft + AVATAR_SIZE },
              ]}
            >
              <Text style={styles.viewMoreText}>View more replies</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 10,
  },
  lineWrapper: {
    position: "absolute",
    left: AVATAR_SIZE / 6,
    top: -AVATAR_SIZE - verticalScale(3),
    bottom: 0,
    width: LINE_INDENT,
  },
  svgLineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  lineTail: {
    position: "absolute",
    left: LINE_INDENT / 2 - 0.8,
    top: AVATAR_SIZE + 7,
    bottom: 0,
    width: 1,
    backgroundColor: "#555",
  },
  contentArea: {
    flex: 1,
    paddingLeft: 8,
    gap: verticalScale(4),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    flex: 1,
  },
  author: {
    fontSize: getFontSize(13),
    color: "#eee",
    marginRight: 6,
    maxWidth: horizontalScale(160),
    fontFamily: "PoppinsSemiBold",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
  },
  content: {
    fontSize: 13,
    color: "#fff",
    marginTop: 2,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  childrenContainer: {
    // marginLeft: AVATAR_SIZE + LINE_INDENT,
    marginTop: verticalScale(20),
  },
  viewMoreBtn: {
    marginTop: 6,
    paddingVertical: 4,
  },
  viewMoreText: {
    color: "#7B61FF",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default CommentItem;
