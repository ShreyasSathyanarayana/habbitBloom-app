import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import RewardIcon from "./reward-icon";

type Props = {
  imageUri: string;
  disable: boolean;
};
const defaultImageUri = require("@/assets/images/default-reward.png");

const RewardIconContainer = ({ imageUri, disable }: Props) => {
  return (
    <View
      style={[
        styles.container,
        disable && { backgroundColor: "rgba(38, 50, 56, 1)" },
      ]}
    >
      <RewardIcon imageUri={disable ? defaultImageUri : imageUri} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(38, 50, 56, 0.4)",
    borderRadius: horizontalScale(8),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: horizontalScale(10),
  },
});

export default RewardIconContainer;
