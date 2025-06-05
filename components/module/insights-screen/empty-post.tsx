import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyPostIcon from "@/assets/svg/Empty-habit-icon.svg";
import { horizontalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";

const _iconSize = horizontalScale(300);

const EmptyPost = () => {
  return (
    <View style={styles.container}>
      <EmptyPostIcon width={_iconSize} height={_iconSize} />
      <ThemedText style={{ fontFamily: "PoppinsMedium" }}>
        No posts yet. Create your first post!
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmptyPost;
