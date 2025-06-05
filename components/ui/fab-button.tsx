import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import PlusIcon from "@/assets/svg/plus-icon.svg";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { horizontalScale, verticalScale } from "@/metric";
import { useTabBar } from "@/context/TabBarContext";
import { useQuery } from "@tanstack/react-query";
import { getHabitCount } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
import { isUserSubscribed } from "@/utils/persist-storage";
import { SheetManager } from "react-native-actions-sheet";

type FabButtonProps = {
  onPress?: () => void;
  isLoading?: boolean;
};

const FabButton = ({ onPress, isLoading = false }: FabButtonProps) => {
  const { isTabBarVisible } = useTabBar();

  // === Button Animation ===
  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isTabBarVisible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    }),
    transform: [
      {
        translateX: withSpring(isTabBarVisible ? 0 : 50, {
          damping: 20,
          stiffness: 150,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.floatingBtnContainer, animatedButtonStyle]}>
      <TouchableOpacity disabled={isLoading} onPress={onPress}>
        <LinearGradient
          colors={["#8A2BE2", "#34127E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingBtn}
        >
          {!isLoading && <PlusIcon />}
          {isLoading && <ActivityIndicator color={"white"} size={"small"} />}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingBtnContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? verticalScale(110) : verticalScale(100),
    right: horizontalScale(15),
  },
  floatingBtn: {
    width: horizontalScale(56),
    height: horizontalScale(56),
    borderRadius: horizontalScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FabButton;
