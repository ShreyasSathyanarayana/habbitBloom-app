import { horizontalScale, verticalScale } from "@/metric";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Avatar from "../streaks/ui/avatar";
import PlusIcon from "@/assets/svg/plus-icon.svg";

type Props = {
  profilePic: string;
  enableAddButton?: boolean;
  onPressAddStory?: () => void;
} & TouchableOpacityProps;

const _iconSize = horizontalScale(12);

const StoryCard = ({
  profilePic,
  onPressAddStory,
  enableAddButton = false,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity {...rest} style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        disabled={!enableAddButton}
        onPress={onPressAddStory}
        style={styles.profileContainer}
      >
        <Avatar uri={profilePic} style={styles.avatarStyle} />
        {enableAddButton && (
          <View style={styles.plusBtn}>
            <PlusIcon width={_iconSize} height={_iconSize} />
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(100),
    height: verticalScale(150),
    borderRadius: horizontalScale(8),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  avatarStyle: {
    width: horizontalScale(36),
    height: horizontalScale(36),
    // position: "absolute",
    borderWidth: 0,
  },
  profileContainer: {
    position: "absolute",
    marginTop: verticalScale(8),
    marginLeft: verticalScale(8),
  },
  plusBtn: {
    backgroundColor: "rgba(138, 43, 226, 1)",
    width: horizontalScale(16),
    height: horizontalScale(16),
    borderRadius: horizontalScale(40),
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -horizontalScale(2),
    right: -horizontalScale(3),
  },
});

export default StoryCard;
