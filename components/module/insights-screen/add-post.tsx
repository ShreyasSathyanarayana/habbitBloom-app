import FabButton from "@/components/ui/fab-button";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const AddPost = () => {
  const onClickAddPost = () => {
    // Navigate to the add post screen or open a modal
    router.push("/(protected)/create-post");
  };
  return <FabButton onPress={onClickAddPost} />;
};

const styles = StyleSheet.create({});

export default AddPost;
