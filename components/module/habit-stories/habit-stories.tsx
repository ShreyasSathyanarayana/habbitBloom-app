import { ThemedText } from "@/components/ui/theme-text";
import { verticalScale } from "@/metric";
import { Divider } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";
import StoriesList from "./stories-list";

const HabitStories = () => {
  return (
    <View style={styles.container}>
      <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>Stories</ThemedText>
      <StoriesList />
      <Divider
        style={{ marginTop: verticalScale(12) }}
        color="rgba(255, 255, 255, 0.18)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
});

export default HabitStories;
