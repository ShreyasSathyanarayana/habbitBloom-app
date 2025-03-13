import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

interface GradientButtonProps extends TouchableOpacityProps {
  title?: string;
  type?: string;
  disable?: boolean;
  isLoading?: boolean; // Loading state
  color?: [string, string, ...string[]]; // Custom gradient colors
}

export function GradientButton({
  title,
  type = "primary",
  disable = false,
  isLoading = false,
  color = ["#00FFFF", "#8A2BE2", "#FF1493"],
  style,
  children,
  ...props
}: GradientButtonProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 10;

    opacity.value = withSpring(1, { damping: 40, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 40, stiffness: 200 });
  }, [title]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <TouchableOpacity
      disabled={disable || isLoading}
      {...props}
      style={[
        { borderRadius: 8, overflow: "hidden" },
        style,
        (disable || isLoading) && { backgroundColor: "rgba(60, 60, 67, 0.6)" },
      ]}
    >
      <LinearGradient
        colors={
          disable || isLoading
            ? ["rgba(60, 60, 67, 0.6)", "rgba(60, 60, 67, 0.6)"]
            : color
        }
        start={{ x: -1, y: 0 }}
        end={{ x: 2, y: 1 }}
        style={{
          padding: 2,
          borderRadius: 10,
          alignItems: "center",
          paddingVertical: verticalScale(12),
          paddingHorizontal: horizontalScale(20),
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="white"
            style={{ paddingVertical: verticalScale(2) }}
          />
        ) : (
          title && (
            <Animated.Text
              style={[
                {
                  color: "white",
                  fontSize: getFontSize(16),
                  fontFamily: "PoppinsBold",
                  includeFontPadding: false,
                  textShadowColor: "transparent",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 0,
                },
                animatedStyle,
                type !== "primary" && { backgroundColor: "black" },
                (disable || isLoading) && { color: "rgba(118, 118, 118, 1)" },
              ]}
            >
              {title}
            </Animated.Text>
          )
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
