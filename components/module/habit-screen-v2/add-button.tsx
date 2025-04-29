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

const AddButton = () => {
  const { isTabBarVisible } = useTabBar();
  const toast = useToast();
  const getHabitCountQuery = useQuery({
    queryKey: ["habitCount"],
    queryFn: () => getHabitCount(),
    // staleTime: 60000,
  });
  const isPremiumUser = isUserSubscribed();

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

  const onPress = () => {
    console.log("habit Count ==>", getHabitCountQuery?.data);
    console.log("isPremiumUser ==>", isPremiumUser);

    if (
      getHabitCountQuery?.status == "error" ||
      getHabitCountQuery?.status == "pending"
    ) {
      toast.show("Something went wrong", { type: "warning" });
      return;
    }
    if (!isPremiumUser && getHabitCountQuery?.data == 6) { // this is for free user
      // toast.show("You can create only 6 habits", { type: "warning" });
      SheetManager.show("habit-limit", {
        payload: { isPremiumUser: isPremiumUser },
      });
      return;
    }
    if (isPremiumUser && getHabitCountQuery?.data >= 20) {  // this is for premium user
      SheetManager.show("habit-limit", {
        payload: { isPremiumUser: isPremiumUser },
      });
      return;
    }
    router.push("/(protected)/create-habit");
  };

  return (
    <Animated.View style={[styles.floatingBtnContainer, animatedButtonStyle]}>
      <TouchableOpacity
        disabled={getHabitCountQuery?.isLoading}
        onPress={onPress}
      >
        <LinearGradient
          colors={["#8A2BE2", "#34127E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingBtn}
        >
          {!getHabitCountQuery?.isLoading && <PlusIcon />}
          {getHabitCountQuery?.isLoading && (
            <ActivityIndicator color={"white"} size={"small"} />
          )}
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

export default AddButton;
