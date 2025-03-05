import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollViewProps, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { useTabBar } from "@/context/TabBarContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCROLL_HIDE_THRESHOLD = 10; // Minimum scroll distance before hiding
const SCROLL_SHOW_THRESHOLD = -5; // Threshold for showing the tab bar

interface ScrollableContainerProps extends ScrollViewProps {
  children: React.ReactNode;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  ...scrollProps
}) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { showTabBar, hideTabBar } = useTabBar();

  useEffect(() => {
    setStatusBarHeight(StatusBar.currentHeight || insets.top || 0);
  }, []);

  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);

  // Handle scroll event
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Derived value to detect scroll direction
  useDerivedValue(() => {
    const diffY = scrollY.value - prevScrollY.value;

    if (diffY > SCROLL_HIDE_THRESHOLD) {
      runOnJS(hideTabBar)();
    } else if (diffY < SCROLL_SHOW_THRESHOLD) {
      runOnJS(showTabBar)();
    }

    // Update previous Y position
    prevScrollY.value = scrollY.value;
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#111", paddingTop: statusBarHeight }}
    >
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Ensures smooth performance
        contentContainerStyle={Platform.OS === "ios" && { paddingBottom: 100 }}
        {...scrollProps}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default ScrollableContainer;
