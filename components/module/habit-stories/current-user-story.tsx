import React from "react";
import { StyleSheet, View } from "react-native";
import StoryCard from "./story-card";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/api";
import { pickImage } from "@/camera-function/camera-picker";

const CurrentUserStory = () => {
  const getUserDetailsQuery = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => {
      return getUserProfile();
    },
    networkMode: "online",
    staleTime: Infinity,
  });

  const handleAddStory = async () => {
    const image = await pickImage();
    console.log("image", image);
  };

  return (
    <View>
      <StoryCard
        profilePic={getUserDetailsQuery?.data?.profile_pic}
        enableAddButton
        onPressAddStory={handleAddStory}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CurrentUserStory;
