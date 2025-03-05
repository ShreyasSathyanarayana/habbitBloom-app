import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollViewProps, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { useTabBar } from "@/context/TabBarContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCROLL_THRESHOLD = 30; // Adjust as needed
const SCROLL_HIDE_THRESHOLD = 2; // Scroll threshold to trigger hide
const SCROLL_SHOW_THRESHOLD = -1; // Scroll threshold to trigger show

interface ScrollableContainerProps extends ScrollViewProps {
  children: React.ReactNode;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  ...scrollProps
}) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const insets = useSafeAreaInsets();
  //  console.log(Platform.OS, StatusBar.currentHeight, insets.bottom, insets.top);
  // const statusBarHeight = insets.top;

  useEffect(() => {
    setStatusBarHeight(StatusBar.currentHeight || insets.top || 0);
  }, []);
  const { showTabBar, hideTabBar } = useTabBar();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0); // Track previous scroll position

  // Handle scroll event
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diffY = currentY - prevScrollY.value;

      // HIDE if scrolling down fast enough
      if (diffY > SCROLL_HIDE_THRESHOLD && currentY > SCROLL_THRESHOLD) {
        runOnJS(hideTabBar)();
      }

      // SHOW if scrolling up slightly
      if (diffY < SCROLL_SHOW_THRESHOLD) {
        runOnJS(showTabBar)();
      }

      prevScrollY.value = currentY; // Update previous scroll position
    },
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#111", paddingTop: statusBarHeight }}
    >
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        {...scrollProps}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default ScrollableContainer;
