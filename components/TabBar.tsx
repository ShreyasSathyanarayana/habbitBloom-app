import { View, StyleSheet, Platform } from "react-native";
import React from "react";
import TabBarButton from "./TabBarButton";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { verticalScale } from "@/metric";
import { useTabBar } from "@/context/TabBarContext";
import Animated, {
  LayoutAnimationConfig,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const primaryColor = "rgba(138, 43, 226, 1)";
  const greyColor = "rgba(157, 178, 206, 1)";
  const { isTabBarVisible } = useTabBar();
  const { bottom: paddingBottom } = useSafeAreaInsets();
  // const translateY = useSharedValue(0);
  const translateY = useDerivedValue(() =>
    withSpring(isTabBarVisible ? 0 : 100, {
      damping: 40, // Less damping for a snappier effect
      stiffness: 200, // Balanced stiffness for quick response
      // mass: 0.5, // Lighter animation for smoother movement
    })
  );

  // Animated style for tab bar
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View style={Platform.OS !== "ios" && animatedStyle}>
        {/** this is only for android */}
        <View
          style={[
            styles.tabbar,
            {
              paddingBottom:
                Platform.OS === "ios"
                  ? verticalScale(paddingBottom)
                  : verticalScale(10),
              borderTopWidth: 0.5,
              borderColor: "rgba(138, 43, 226, 1)",
            },
            { backgroundColor: "black" },
          ]}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            if (["_sitemap", "+not-found"].includes(route.name)) return null;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TabBarButton
                key={route.name}
                // style={styles.tabbarItem}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={isFocused ? primaryColor : greyColor}
                label={label}
              />
            );
          })}
        </View>
      </Animated.View>
    </LayoutAnimationConfig>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    // marginHorizontal: 20,
    paddingVertical: 15,
    // borderRadius: 25,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,

    // Add this to prevent blur effects in iOS
    backdropFilter: "none",
  },
});

export default TabBar;
