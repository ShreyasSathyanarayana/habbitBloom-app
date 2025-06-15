import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { Divider } from "@rneui/base";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import StoryCard from "./story-card";
import CurrentUserStory from "./current-user-story";

const StoriesList = () => {
  return (
    <FlatList
      style={{ marginTop: verticalScale(16) }}
      data={[1, 1, 1, 1, 1, 1, 11]}
      horizontal
      ListHeaderComponent={() => <CurrentUserStory />}
      ListHeaderComponentStyle={{ marginRight: horizontalScale(8) }}
      ItemSeparatorComponent={() => (
        <View style={{ width: horizontalScale(8) }} />
      )}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => <StoryCard profilePic="" />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
});

export default StoriesList;
