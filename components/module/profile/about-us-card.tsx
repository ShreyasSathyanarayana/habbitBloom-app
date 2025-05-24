import React from "react";
import { StyleSheet, View } from "react-native";
import AvatarImage from "./avatar-image";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";

type Props = {
  profile_pic: string;
  full_name: string;
  email: string;
  profile_bio: string;
};

const AboutUsCard = ({ profile_bio, email, full_name, profile_pic }: Props) => {
  return (
    <View style={styles.container}>
      <AvatarImage imageType="Option" imageUri={profile_pic} />
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
    justifyContent:'space-around'
  },
});

export default AboutUsCard;
