import { useRouter } from "expo-router";
import React, { version } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import BackArrow from "@/assets/svg/back-arrow.svg";
import { horizontalScale, verticalScale } from "@/metric";

const BackButton = ({ style }: TouchableOpacityProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      hitSlop={20}
      onPress={() => router.back()}
      style={[{ marginBottom: 28, left: -10 }, style]}
    >
      <BackArrow width={horizontalScale(24)} height={verticalScale(24)} />
    </TouchableOpacity>
  );
};

export default BackButton;
