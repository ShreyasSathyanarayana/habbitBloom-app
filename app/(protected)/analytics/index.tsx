import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import CalenderAnalytics from "@/components/module/analytics-screen/calender-analytics";
import StatisticsAnalytics from "@/components/module/analytics-screen/statistics/statistics-analytics";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const Analytics = () => {
  const { id, category } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState(category);
  const menu = ["Calendar", "Statistics"];

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
          onChangeMenu={(item, index) => setSelectedOption(item)}
        />
        {selectedOption === "Calendar" && (
          <CalenderAnalytics habitId={id as string} />
        )}
        {selectedOption === "Statistics" && (
          <StatisticsAnalytics habitId={id as string} />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Analytics;
