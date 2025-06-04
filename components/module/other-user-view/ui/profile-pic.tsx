import { OtherUserProfile } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { useImage } from "@/context/ImageContext";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import PremiumIcon from "@/assets/svg/premium-icon.svg";
import { blurhash } from "../../profile/avatar-image";
import { Skeleton } from "moti/skeleton";

const _defaultImage = require("@/assets/images/default_other_profile.png");

const _withImageGradient: [string, string] = [
  "rgba(0,0,0, 0)",
  "rgba(0, 0, 0, 0.8)",
];
const _withoutImageGradient: [string, string] = [
  "rgba(255, 255, 255, 0)",
  "rgba(255, 255, 255, 0.1)",
];

type Props={
  userDetails?: OtherUserProfile|null;
  isLoading?: boolean;
}

const ProfilePic = ({userDetails,isLoading}: Props) => {
  const { showImage } = useImage();
  return (
    <Skeleton show={isLoading}>
    <TouchableOpacity
      onPress={() => {
        if (userDetails?.profile_pic) {
          showImage(userDetails?.profile_pic);
        }
      }}
      style={[styles.container, !userDetails?.profile_pic && styles.emptyImage]}
    >
      <LinearGradient
        colors={userDetails?.profile_pic ? _withImageGradient : _withoutImageGradient}
        start={{ x: 0.5, y: 0.5 }} // 68.67%
        end={{ x: 0.5, y: 1 }} // 100%
        style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
      />

      <Image
        style={styles.imageStyle}
        placeholder={{blurhash}}
        // contentFit="cover"
        source={userDetails?.profile_pic ? { uri: userDetails.profile_pic } : _defaultImage}
      />
      <View style={styles.textContainer}>
        <ThemedText style={styles.userNameStyle}>{userDetails?.full_name}</ThemedText>
        <ThemedText numberOfLines={3} style={{ fontSize: getFontSize(12) }}>
          {userDetails?.profile_bio}
        </ThemedText>
      </View>
      {/**Premium Icon */}
      {userDetails?.role === "admin" && (
        <View style={styles.premiumContainer}>
          <PremiumIcon width={horizontalScale(16)} height={verticalScale(16)} />
          <ThemedText style={{ fontSize: getFontSize(12) }}>Premium</ThemedText>
        </View>
      )}
    </TouchableOpacity>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(375),
    borderRadius: horizontalScale(32),
    overflow: "hidden",
  },
  imageStyle: {
    flex: 1,
  },
  emptyImage: {
    borderWidth: horizontalScale(1),
    borderColor: "rgba(255, 255, 255, 0.48)",
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: horizontalScale(16),
    zIndex: 4,
    gap: verticalScale(8),
    paddingBottom: verticalScale(20),
  },
  userNameStyle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: getFontSize(24),
  },
  premiumContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    borderColor: "rgba(255, 204, 5, 1)",
    borderWidth: horizontalScale(1),
    borderRadius: horizontalScale(16),
    position: "absolute",
    top: 0,
    right: 0,
    margin: horizontalScale(16),
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
  },
});

export default ProfilePic;
