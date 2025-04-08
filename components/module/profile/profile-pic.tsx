import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileEditIcon from "@/assets/svg/profile-edit-icon.svg";
import PremiumProfileIcon from "@/assets/svg/premium-profile-icon.svg";
import { horizontalScale } from "@/metric";
import { SheetManager } from "react-native-actions-sheet";
import { Image } from "expo-image";
const _iconSize = horizontalScale(32);
const _premiumIconSize = horizontalScale(40);
type Props = {
  profilePic: string | null;
  isSubscribed?: boolean;
};

const _defautIconSize = horizontalScale(120);

const avatar = require("@/assets/images/avatar.png");

const blurhash = "L-MZj?s..TNI%Lj[t7aeTKa}%1oJ";

const ProfilePic = ({ profilePic, isSubscribed }: Props) => {
  return (
    <View style={[styles.container, isSubscribed && styles.premiumStyle]}>
      {isSubscribed && (
        <PremiumProfileIcon
          style={styles.premiumIconStyle}
          width={_premiumIconSize}
          height={_premiumIconSize}
        />
      )}
      {profilePic === null && (
        <View
          style={{
            flex: 1,
            overflow: "hidden",
            borderRadius: horizontalScale(120),
          }}
        >
          <Image
            style={{
              flex: 1,
            }}
            source={require("@/assets/images/default-profile.png")}
          />
        </View>
      )}
      <Pressable
        onPress={() =>
          SheetManager.show("profile-pic", {
            payload: { profile_pic: profilePic },
          })
        }
        style={styles.editBtnStyle}
      >
        <ProfileEditIcon width={_iconSize} height={_iconSize} />
      </Pressable>
      {profilePic && (
        <View
          style={{
            flex: 1,
            overflow: "hidden",
            borderRadius: horizontalScale(120),
          }}
        >
          <Image
            style={{
              flex: 1,
            }}
            // source={avatar}
            placeholder={{ blurhash }}
            source={profilePic}
            transition={500}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(120),
    borderWidth: horizontalScale(8),
    backgroundColor: "rgba(217, 217, 217, 1)",
    borderColor: "rgba(138, 43, 226, 0.4)",
    elevation: 2,
    // overflow: "hidden",
  },
  editBtnStyle: {
    position: "absolute",
    bottom: 0,
    right: horizontalScale(5),
    zIndex: 2,
  },
  premiumStyle: {
    borderColor: "rgba(239, 191, 4, 1)",
  },
  premiumIconStyle: {
    position: "absolute",
    top: horizontalScale(-27),
    left: 0,
  },
});

export default ProfilePic;
