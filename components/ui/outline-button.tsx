import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import React, { useEffect } from "react";
import { ThemedText } from "./theme-text";

interface GradientButtonProps extends TouchableOpacityProps {
  title?: string;
  type?: string;
  disable?: boolean;
  children?: React.ReactNode;
  color?: [string, string, ...string[]]; // Custom gradient colors
}

export function OutlineButton({
  title,
  type = "primary", // secondary
  disable = false,
  color = ["#00FFFF", "#8A2BE2", "#FF1493"], // Default gradient colors
  style,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      disabled={disable}
      {...props}
      style={[
        { borderRadius: 8, overflow: "hidden" },
        style,
        disable && { backgroundColor: "rgba(60, 60, 67, 0.6)" },
      ]}
    >
      <LinearGradient
        colors={
          disable ? ["rgba(60, 60, 67, 0.6)", "rgba(60, 60, 67, 0.6)"] : color
        }
        start={{ x: -1, y: 0 }} // Approx. -96.01% (Left-Extended)
        end={{ x: 2, y: 1 }} // Approx. 198.2% (Right-Extended)
        style={{
          // alignItems: "center",
          // justifyContent: "center",
          padding: 2,
          borderRadius: 10,
        }}
      >
        {children}
        {title && (
          <ThemedText
            allowFontScaling={false}
            style={[
              {
                color: "white",
                fontSize: getFontSize(16),
                fontFamily: "PoppinsBold",
                paddingVertical: verticalScale(12),
                paddingHorizontal: horizontalScale(20),
                backgroundColor: "black",
                borderRadius: 10,
                textAlign: "center",
                includeFontPadding: false,
                textShadowColor: "transparent",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 0,
              },
              // animatedStyle,
              // type != "primary" && { backgroundColor: "black" },
              disable && { color: "rgba(118, 118, 118, 1)" },
            ]}
          >
            {title}
          </ThemedText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
