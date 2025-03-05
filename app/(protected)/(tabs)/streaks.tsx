import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Streaks = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ThemedText>streaks</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Streaks;
