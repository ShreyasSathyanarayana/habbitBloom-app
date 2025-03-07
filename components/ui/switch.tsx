import { horizontalScale } from "@/metric";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Define the props interface for the component
interface SwitchProps {
  value: boolean; // Boolean to track the switch state
  onPress: () => void; // Function to handle onPress
  style?: StyleProp<ViewStyle>; // Optional custom styles
  duration?: number; // Duration for the animations
  trackColors?: { on: string; off: string }; // Colors for the track (on/off states)
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = { on: "rgba(52, 199, 89, 1)", off: "silver" },
}) => {
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value ? 1 : 0,
      [0, 1],
      [trackColors.off, trackColors.on]
    );

    return {
      backgroundColor: withTiming(color, { duration }),
      borderRadius: 40 / 2, // Set a fixed border radius
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      value ? 1 : 0,
      [0, 1],
      [0, 60 - 35] // Use fixed width and height
    );

    return {
      transform: [{ translateX: withTiming(moveValue, { duration }) }],
      borderRadius: 35 / 2, // Ensure the thumb remains circular
    };
  });

  return (
    <Pressable onPress={onPress}>
      <LayoutAnimationConfig skipEntering>
        <Animated.View
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
            width.value = e.nativeEvent.layout.width;
          }}
          style={[styles.track, style, trackAnimatedStyle]}
        >
          <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
        </Animated.View>
      </LayoutAnimationConfig>
    </Pressable>
  );
};

// Styles for the Switch component
const styles = StyleSheet.create({
  track: {
    alignItems: "flex-start",
    width: horizontalScale(60),
    height: horizontalScale(35),
    padding: horizontalScale(4),
  },
  thumb: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "white",
  },
});

export default Switch;
