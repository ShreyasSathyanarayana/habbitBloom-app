import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CommentItem, { Comment } from "./comment-item";

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  return (
    <ScrollView style={styles.container}>
      {comments.map((comment, index) => (
        <CommentItem
          onReplyPress={(id) => console.log("Replying to comment:", id)}
          key={comment.id}
          comment={comment}
          isLastChild={index === comments.length - 1}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor: "#fff",
  },
});

export default CommentsSection;
