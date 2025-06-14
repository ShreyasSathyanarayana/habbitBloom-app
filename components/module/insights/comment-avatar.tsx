import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Avatar from "../streaks/ui/avatar";
import { horizontalScale } from "@/metric";
type Props = {
  uri: string;
  style?: StyleProp<ViewStyle>;
};

const CommentAvatar = ({ uri, style }: Props) => {
  return <Avatar uri={uri} style={[styles.imageStyle, style]} />;
};

const styles = StyleSheet.create({
  imageStyle: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderWidth: 0,
  },
});

export default CommentAvatar;
