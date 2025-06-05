import PostHeader from "@/components/module/create-or-edit-post/post-header";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const Index = () => {
  return (
    <Container
      style={[
        Platform.OS == "ios" && {
          backgroundColor: "rgba(17, 17, 17, 1)",
        },
      ]}
    >
      <PostHeader
        title={"Create Post"}
        isLoading={false}
        disablePostButton={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Index;
