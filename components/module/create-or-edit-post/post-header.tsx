import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  title: string;
  isLoading?: boolean;
  disablePostButton?: boolean;
  onClickCancel: () => void;
  onClickOnPost: () => void;
};

const PostHeader = ({
  title,
  disablePostButton,
  isLoading,
  onClickCancel,
  onClickOnPost,
}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClickCancel}>
        <ThemedText style={styles.buttonTextStyle}>Cancel</ThemedText>
      </TouchableOpacity>
      <ThemedText
        style={{ fontSize: getFontSize(17), fontFamily: "PoppinsSemiBold" }}
      >
        {title}
      </ThemedText>
      <TouchableOpacity
        disabled={disablePostButton || isLoading}
        onPress={onClickOnPost}
        style={{
          width: horizontalScale(40),
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {!isLoading && (
          <ThemedText
            style={[
              styles.buttonTextStyle,
              disablePostButton && { color: "rgba(255, 255, 255, 0.48)" },
            ]}
          >
            Post
          </ThemedText>
        )}
        {isLoading && <ActivityIndicator color={"white"} size={"small"} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(16),
    borderBottomWidth: horizontalScale(1),
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: horizontalScale(16),
    // paddingVertical: verticalScale(16),
  },
  buttonTextStyle: {
    fontSize: getFontSize(14),
  },
});

export default PostHeader;
