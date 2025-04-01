import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import TabBarButton from "./TabBarButton";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { verticalScale } from "@/metric";
import { useTabBar } from "@/context/TabBarContext";
import Animated, {
  LayoutAnimationConfig,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
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
  // if (Platform.OS === "ios") {
  //   return (
  //     <BlurView
  //       experimentalBlurMethod="dimezisBlurView"
  //       intensity={30}
  //       tint="dark"
  //       style={[
  //         styles.tabbar,
  //         Platform.OS === "ios"
  //           ? { paddingBottom: verticalScale(20) }
  //           : { paddingBottom: verticalScale(10) },
  //         Platform.OS !== "ios" && { backgroundColor: "black" },
  //       ]}
  //     >
  //       {state.routes.map((route, index) => {
  //         const { options } = descriptors[route.key];
  //         const label =
  //           options.tabBarLabel !== undefined
  //             ? options.tabBarLabel
  //             : options.title !== undefined
  //             ? options.title
  //             : route.name;

  //         if (["_sitemap", "+not-found"].includes(route.name)) return null;

  //         const isFocused = state.index === index;

  //         const onPress = () => {
  //           const event = navigation.emit({
  //             type: "tabPress",
  //             target: route.key,
  //             canPreventDefault: true,
  //           });

  //           if (!isFocused && !event.defaultPrevented) {
  //             navigation.navigate(route.name, route.params);
  //           }
  //         };

  //         const onLongPress = () => {
  //           navigation.emit({
  //             type: "tabLongPress",
  //             target: route.key,
  //           });
  //         };

  //         return (
  //           <TabBarButton
  //             key={route.name}
  //             // style={styles.tabbarItem}
  //             onPress={onPress}
  //             onLongPress={onLongPress}
  //             isFocused={isFocused}
  //             routeName={route.name}
  //             color={isFocused ? primaryColor : greyColor}
  //             label={label}
  //           />
  //         );

  //         // return (
  //         //   <TouchableOpacity
  //         //     key={route.name}
  //         //     style={styles.tabbarItem}
  //         //     accessibilityRole="button"
  //         //     accessibilityState={isFocused ? { selected: true } : {}}
  //         //     accessibilityLabel={options.tabBarAccessibilityLabel}
  //         //     testID={options.tabBarTestID}
  //         //     onPress={onPress}
  //         //     onLongPress={onLongPress}
  //         //   >
  //         //     {
  //         //         icons[route.name]({
  //         //             color: isFocused? primaryColor: greyColor
  //         //         })
  //         //     }
  //         //     <Text style={{
  //         //         color: isFocused ? primaryColor : greyColor,
  //         //         fontSize: 11
  //         //     }}>
  //         //       {label}
  //         //     </Text>
  //         //   </TouchableOpacity>
  //         // );
  //       })}
  //     </BlurView>
  //   );
  // }
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

            // return (
            //   <TouchableOpacity
            //     key={route.name}
            //     style={styles.tabbarItem}
            //     accessibilityRole="button"
            //     accessibilityState={isFocused ? { selected: true } : {}}
            //     accessibilityLabel={options.tabBarAccessibilityLabel}
            //     testID={options.tabBarTestID}
            //     onPress={onPress}
            //     onLongPress={onLongPress}
            //   >
            //     {
            //         icons[route.name]({
            //             color: isFocused? primaryColor: greyColor
            //         })
            //     }
            //     <Text style={{
            //         color: isFocused ? primaryColor : greyColor,
            //         fontSize: 11
            //     }}>
            //       {label}
            //     </Text>
            //   </TouchableOpacity>
            // );
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
