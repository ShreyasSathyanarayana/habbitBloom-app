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
import { useEffect } from "react";

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  color?: [string, string, ...string[]]; // Custom gradient colors
}

export function GradientButton({
  title,
  color = ["#00FFFF", "#8A2BE2", "#FF1493"], // Default gradient colors
  style,
  ...props
}: GradientButtonProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 10;

    // opacity.value = withTiming(1, { duration: 300 });
    opacity.value = withSpring(1, { damping: 40, stiffness: 200 });
    // translateY.value = withTiming(0, { duration: 500 });
    translateY.value = withSpring(0, {
      damping: 40,
      stiffness: 200,
    });
  }, [title]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <TouchableOpacity
      {...props}
      style={[{ borderRadius: 8, overflow: "hidden", flex: 1 }, style]}
    >
      <LinearGradient
        colors={color}
        start={{ x: -1, y: 0 }} // Approx. -96.01% (Left-Extended)
        end={{ x: 2, y: 1 }} // Approx. 198.2% (Right-Extended)
        style={{
          paddingVertical: verticalScale(12),
          paddingHorizontal: horizontalScale(20),
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
        }}
      >
        <Animated.Text
          style={[
            {
              color: "white",
              fontSize: getFontSize(16),
              fontFamily: "Poppins_700Bold",
            },
            animatedStyle,
          ]}
        >
          {title}
        </Animated.Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
