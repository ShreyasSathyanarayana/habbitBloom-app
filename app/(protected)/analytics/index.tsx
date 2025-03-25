import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import CalenderAnalytics from "@/components/module/analytics-screen/calender-analytics";
import StatisticsAnalytics from "@/components/module/analytics-screen/statistics/statistics-analytics";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { LayoutAnimationConfig } from "react-native-reanimated";

const Analytics = () => {
  const { id, category } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState(category);
  const menu = ["Calendar", "Statistics"];
  const pagerRef = useRef<PagerView>(null);

  return (
    <Container>
      <Header title="Analytics" />
      <View
        style={{
          paddingHorizontal: horizontalScale(16),
          gap: verticalScale(24),
          flex: 1,
        }}
      >
        <AnalyticsBar
          menu={menu}
          selectedMenu={category as string}
          onChangeMenu={(item, index) => {
            pagerRef.current?.setPage(index);
            setSelectedOption(item);
          }}
        />

        <PagerView
          ref={pagerRef}
          scrollEnabled={false}
          initialPage={category === "Calendar" ? 0 : 1}
          style={{ flex: 1 }}
        >
          <View key="1">
            <CalenderAnalytics habitId={id as string} />
          </View>
          <View key="2">
            <StatisticsAnalytics habitId={id as string} />
          </View>
        </PagerView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Analytics;
