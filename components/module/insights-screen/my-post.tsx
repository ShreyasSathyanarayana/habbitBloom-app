import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyPost from "./empty-post";

const MyPost = () => {
  if (true) { // Replace with No posts condition
    return <EmptyPost />;
  }
  return (
    <View>
      <ThemedText>MyPost</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MyPost;
