import AvatarSection from "@/components/module/profile/avatar-section";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { horizontalScale } from "@/metric";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const ProfilePicScreen = () => {
  const { profilePic } = useLocalSearchParams() as {
    profilePic: string | undefined;
  };
  //   console.log(profilePic);

  return (
    <Container>
      <Header title="Avatars" />
      <View style={styles.container}>
        <AvatarSection currentProfilePic={profilePic ?? null} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: horizontalScale(16),
    paddingBottom: 0,
  },
});

export default ProfilePicScreen;
