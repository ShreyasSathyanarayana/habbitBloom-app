import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileEditIcon from "@/assets/svg/profile-edit-icon.svg";
import PremiumProfileIcon from "@/assets/svg/premium-profile-icon.svg";
import { horizontalScale } from "@/metric";
const _iconSize = horizontalScale(32);
const _premiumIconSize = horizontalScale(40);
type Props = {
  profilePic: string | null;
  isSubscribed?: boolean;
};

const ProfilePic = ({ profilePic, isSubscribed }: Props) => {
  return (
    <View style={[styles.container, isSubscribed && styles.premiumStyle]}>
      <PremiumProfileIcon
        style={styles.premiumIconStyle}
        width={_premiumIconSize}
        height={_premiumIconSize}
      />
      <Pressable style={styles.editBtnStyle}>
        <ProfileEditIcon width={_iconSize} height={_iconSize} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(120),
    backgroundColor: "rgba(217, 217, 217, 1)",
  },
  editBtnStyle: {
    position: "absolute",
    bottom: 0,
    right: horizontalScale(5),
    zIndex: 2,
  },
  premiumStyle: {
    borderWidth: horizontalScale(8),
    borderColor: "rgba(239, 191, 4, 1)",
  },
  premiumIconStyle: {
    position: "absolute",
    top: horizontalScale(-27),
    left: 0,
  },
});

export default ProfilePic;
