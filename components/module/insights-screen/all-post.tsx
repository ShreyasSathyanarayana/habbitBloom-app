import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyPost from "./empty-post";

const AllPost = () => {
  if (true) {
    // Replace with No posts condition
    return <EmptyPost />;
  }
  return (
    <View>
      <ThemedText>AllPost</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AllPost;
