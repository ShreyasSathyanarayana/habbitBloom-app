import {
  fetchMonthlyHabitProgress,
  fetchWeeklyHabitProgress,
  fetchYearlyHabitProgress,
} from "@/api/api";
import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import AnalyticsDetails from "@/components/module/analytics-screen/analytics-details";
import AnalyticsMap from "@/components/module/analytics-screen/analytics-map";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { getCategoryByName } from "@/utils/constants";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
const menu = ["Weekly", "Monthly", "Year"];
const AnalyticsScreen = () => {
  const [selectedMenu, setSelectedMenu] = React.useState(menu[0]);
  const route = useRoute<{
    key: string;
    name: string;
    params: { id: string; name: string; category: string };
  }>();
  const { id: habitId, name: habitName, category } = route.params;
  const onPressMenu = (item: string, index: number) => {
    setSelectedMenu(item);
  };
  const categoryDetails = getCategoryByName(category);
  return (
    <Container>
      <Header
        title={habitName ?? "Analytics"}
        headerIcon={categoryDetails?.icon}
        rightIcon={
          <TouchableOpacity
            style={{ paddingHorizontal: horizontalScale(3) }}
            onPress={() => {
              router.push(`/(protected)/create-habit?id=${habitId}`);
            }}
          >
            <ThemedText style={{ fontSize: getFontSize(14) }}>Edit</ThemedText>
          </TouchableOpacity>
        }
      />
      <View
        style={{
          paddingHorizontal: horizontalScale(16),
          paddingTop: verticalScale(10),
        }}
      >
        <AnalyticsBar onChageMenu={onPressMenu} />
        <AnalyticsDetails selectedOption={selectedMenu} />
        <AnalyticsMap habitId={habitId} selectedMenu={selectedMenu} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default AnalyticsScreen;
