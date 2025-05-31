import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AvatarImage from "./avatar-image";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import { useImage } from "@/context/ImageContext";
import { SheetManager } from "react-native-actions-sheet";

type Props = {
  profile_pic: string;
  full_name: string;
  email: string;
  profile_bio: string;
};

const AboutUsCard = ({ profile_bio, email, full_name, profile_pic }: Props) => {
  const { showImage } = useImage();
  const onProfilePicPress = () => {
    if (profile_pic) {
      SheetManager.hide("about-us");
      setTimeout(() => {
        showImage(profile_pic);
      }, 300);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onProfilePicPress}>
        <AvatarImage imageType="Option" imageUri={profile_pic} />
      </TouchableOpacity>
      <ThemedText style={{ fontSize: getFontSize(14) }}>{full_name}</ThemedText>
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
    </View>
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
