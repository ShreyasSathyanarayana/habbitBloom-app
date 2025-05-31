import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { Image } from "expo-image";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
type AvatarProps = {
  uri: string;
  style?: StyleProp<ViewStyle>;
  rank?: number;
  badgeStyle?: StyleProp<ViewStyle>;
};

const Avatar = ({ uri, style, rank,badgeStyle }: AvatarProps) => {
  //  source={require("@/assets/images/default-profile.png")}
  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.imageStyle}
        source={
          uri ? { uri: uri } : require("@/assets/images/default-profile.png")
        }
      />
      {rank && (
        <View style={[styles.badge, badgeStyle]}>
          <ThemedText style={{ fontSize: getFontSize(13) }}>{rank}</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(52),
    height: horizontalScale(52),
    borderRadius: horizontalScale(100),
    borderWidth: horizontalScale(2),
    borderColor: "rgba(138, 43, 226, 1)",
  },
  imageStyle: {
    flex: 1,
    borderRadius: horizontalScale(100),
  },
  badge: {
    position: "absolute",
    top: horizontalScale(-2),
    left: horizontalScale(-2),
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: horizontalScale(30),
    backgroundColor: "rgba(138, 43, 226, 1)",
    // borderWidth: horizontalScale(1),
    // borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Avatar;
