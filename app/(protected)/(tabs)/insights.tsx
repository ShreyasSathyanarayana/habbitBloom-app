import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import AddPost from "@/components/module/insights-screen/add-post";
import AllPost from "@/components/module/insights-screen/all-post";
import MyPost from "@/components/module/insights-screen/my-post";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const MENU_OPTIONS = ["Current Streak", "Completed Streak"];

const Insights = () => {
  const insets = useSafeAreaInsets();
  const pagerRef = React.useRef<PagerView>(null);
  const [selectedMenu, setSelectedMenu] = React.useState(MENU_OPTIONS[0]);

  const onChangeMenu = useCallback((item: string, index: number) => {
    setSelectedMenu(item);
    pagerRef.current?.setPageWithoutAnimation(index);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AnalyticsBar
        menu={MENU_OPTIONS}
        selectedMenu={selectedMenu}
        onChangeMenu={onChangeMenu}
      />
      <PagerView style={{ flex: 1 }} ref={pagerRef}>
        <View key="1" style={{ flex: 1 }}>
          <AllPost />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <MyPost />
        </View>
      </PagerView>
      <AddPost />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "black",
  },
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

export default Insights;
