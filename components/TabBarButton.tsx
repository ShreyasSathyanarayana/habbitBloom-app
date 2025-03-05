import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { activeIcons, icons, inactiveIcons } from "@/assets/icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import HabitActiveIcon from "@/assets/tab-icons/habits-active.svg";
import { getFontSize } from "@/font";
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabBarButton = (props: BottomTabBarProps | any) => {
  const { isFocused, label, routeName, color } = props;
  //   console.log("route Name==>", routeName, isFocused);

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      // styles
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      // styles
      opacity,
    };
  });
  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {isFocused ? activeIcons[routeName] : inactiveIcons[routeName]}
      </Animated.View>

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
