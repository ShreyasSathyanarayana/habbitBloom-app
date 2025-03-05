import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Profile = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ThemedText>Profile</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Profile;
