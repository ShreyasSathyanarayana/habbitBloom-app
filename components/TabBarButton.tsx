import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { activeIcons, inactiveIcons } from "@/assets/icon";
import { getFontSize } from "@/font";

interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  isFocused,
  label,
  routeName,
  color,
  onPress,
  onLongPress,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
}) => {
  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.4]) }],
    top: interpolate(scale.value, [0, 1], [0, 8]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0, 1], [1, 0]),
  }));

  const Icon = isFocused ? activeIcons[routeName] : inactiveIcons[routeName];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole??"button"}
      accessibilityState={accessibilityState}
      style={styles.container}
    >
      <Animated.View style={animatedIconStyle}>{Icon}</Animated.View>

      <Animated.Text
        style={[
          {
            color,
            fontSize: getFontSize(12),
            fontFamily: "PoppinsRegular",
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

export default TabBarButton;
