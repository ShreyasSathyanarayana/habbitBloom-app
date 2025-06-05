import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import AvatarImage from "./avatar-image";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import { SheetManager } from "react-native-actions-sheet";
import { router } from "expo-router";

type Props = {
  profile_pic: string;
  full_name: string;
  email: string;
  profile_bio: string;
  id: string;
};

const AboutUsCard = ({
  profile_bio,
  email,
  full_name,
  profile_pic,
  id,
}: Props) => {
  const onProfilePicPress = () => {
    if (profile_pic) {
      SheetManager.hide("about-us");
      setTimeout(() => {
        // showImage(profile_pic);
        router.push({
          pathname: "/(protected)/other-user-view",
          params: { userId: id },
        });
      }, 300);
    }
  };
  return (
    <Pressable onPress={onProfilePicPress} style={styles.container}>
      <TouchableOpacity onPress={onProfilePicPress}>
        <AvatarImage imageType="Option" imageUri={profile_pic} />
      </TouchableOpacity>
      <ThemedText style={{ fontSize: getFontSize(14), textAlign: "center" }}>
        {full_name}
      </ThemedText>
      <ThemedText style={{ fontSize: getFontSize(12), textAlign: "center" }}>
        {email}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: getFontSize(12),
          textAlign: "center",
          fontFamily: "PoppinsItalic",
        }}
      >
        {profile_bio}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: verticalScale(8),
    // backgroundColor: "red",
    padding: horizontalScale(8),
    justifyContent: "space-around",
  },
});

export default AboutUsCard;
