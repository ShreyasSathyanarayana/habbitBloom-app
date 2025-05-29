import { getHighestCompletedHabitList, getUserStreaks } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import LeaderBoardIcon from "@/assets/svg/leader-board.svg";
import LeaderBoardIcon1 from "@/assets/svg/leader-board1.svg";
import { horizontalScale, verticalScale } from "@/metric";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
const MENU_OPTIONS = ["Current Streak", "Completed Streak"];

const Streaks = () => {
  const insets = useSafeAreaInsets();
  const [selectedMenu, setSelectedMenu] = React.useState(MENU_OPTIONS[0]);
  const getUserStreakQuery = useQuery({
    queryKey: ["getUserStreak"],
    queryFn: () => getUserStreaks(),
  });

  const getCompletedStreakQuery = useQuery({
    queryKey: ["getCompletedStreak"],
    queryFn: () => getHighestCompletedHabitList(),
  });

  const onChangeMenu = useCallback((item: string, index: number) => {
    setSelectedMenu(item);
    // pagerRef.current?.setPageWithoutAnimation(index);
  }, []);

  console.log(
    "getUserStreakQuery",
    JSON.stringify(getUserStreakQuery.data, null, 2)
  );

  // console.log(
  //   "getCompletedStreakQuery",
  //   JSON.stringify(getCompletedStreakQuery.data, null, 2)
  // );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, gap: verticalScale(16) },
      ]}
    >
      {/* <ThemedText>streaks</ThemedText> */}
      {/* <LeaderBoardIcon width={horizontalScale(349)} /> */}
      <AnalyticsBar
        menu={MENU_OPTIONS}
        selectedMenu={selectedMenu}
        onChangeMenu={onChangeMenu}
      />
      <LeaderBoardIcon1 width={horizontalScale(349)}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "black",
    paddingTop: verticalScale(16),
  },
});

export default Streaks;
