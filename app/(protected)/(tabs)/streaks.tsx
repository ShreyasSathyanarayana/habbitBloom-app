import React, { useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { horizontalScale, verticalScale } from "@/metric";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import PagerView from "react-native-pager-view";
import CurrentStreak from "@/components/module/streaks/current-streak";
import CompletedStreak from "@/components/module/streaks/completed-streak";
const MENU_OPTIONS = ["Current Streak", "Completed Streak"];

const Streaks = () => {
  const insets = useSafeAreaInsets();
  const pagerRef = React.useRef<PagerView>(null);
  const [selectedMenu, setSelectedMenu] = React.useState(MENU_OPTIONS[0]);

  const onChangeMenu = useCallback((item: string, index: number) => {
    setSelectedMenu(item);
    pagerRef.current?.setPageWithoutAnimation(index);
  }, []);

  // console.log(
  //   "getCompletedStreakQuery",
  //   JSON.stringify(getCompletedStreakQuery.data, null, 2)
  // );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + verticalScale(20),
          gap: verticalScale(16),
        },
      ]}
    >
      {/* <ThemedText>streaks</ThemedText> */}
      {/* <LeaderBoardIcon width={horizontalScale(349)} /> */}
      <AnalyticsBar
        menu={MENU_OPTIONS}
        selectedMenu={selectedMenu}
        onChangeMenu={onChangeMenu}
      />
      <PagerView scrollEnabled={false} ref={pagerRef} style={{ flex: 1 }}>
        <View key="1" style={{ flex: 1 }}>
          <CurrentStreak />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <CompletedStreak />
        </View>
      </PagerView>
      {/* <LeaderBoardIcon1 width={horizontalScale(349)}  /> */}
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
