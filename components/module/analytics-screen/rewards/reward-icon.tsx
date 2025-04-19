import { horizontalScale } from "@/metric";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
type Props = {
  imageUri: string;
  style?: ViewStyle;
};

const RewardIcon = ({ imageUri, style }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <Image style={{ flex: 1 }} source={imageUri} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(30),
    height: horizontalScale(40),
    backgroundColor: "transparent",
  },
});

export default RewardIcon;
