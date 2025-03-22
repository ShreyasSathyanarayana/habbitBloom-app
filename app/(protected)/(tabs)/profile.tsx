import { GradientButton } from "@/components/ui/gradient-button";
import { ThemedText } from "@/components/ui/theme-text";
import { useAuth } from "@/context/AuthProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const { logout } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <GradientButton title="SignOut" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Profile;
