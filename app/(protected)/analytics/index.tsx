import { getHabitById } from "@/api/api";
import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import AnalyticsHeader from "@/components/module/analytics-screen/analytics-header";
import CalenderAnalytics from "@/components/module/analytics-screen/calender-analytics";
import StatisticsAnalytics from "@/components/module/analytics-screen/statistics/statistics-analytics";
import NoInternet from "@/components/module/errors/no-internet";
import Container from "@/components/ui/container";

import { useAuth } from "@/context/AuthProvider";
import { horizontalScale, verticalScale } from "@/metric";
import { getCategoryByName } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { LayoutAnimationConfig } from "react-native-reanimated";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Analytics = () => {
  const { id, category } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState(category);
  const { isConnected } = useAuth();
  const menu = ["Calendar", "Statistics"];
  const pagerRef = useRef<PagerView>(null);
  const getHabitDetailsQuery = useQuery({
    queryKey: ["habitDetails", id],
    queryFn: () => getHabitById(id as string),
    enabled: !!id,
  });
  const CategoryIcon = getCategoryByName(
    getHabitDetailsQuery?.data?.category ?? ""
  )?.icon;

  if (!isConnected) {
    return <NoInternet onRefresh={() => getHabitDetailsQuery?.refetch()} />;
  }

  // console.log(JSON.stringify(getHabitDetailsQuery?.data, null, 2));

  return (
    <Container>
      {/* <Header isLoading={true} title="Analytics" /> */}
      <AnalyticsHeader
        headerIcon={CategoryIcon}
        isLoading={getHabitDetailsQuery?.isLoading}
        title={getHabitDetailsQuery.data?.habit_name}
      />
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
            // console.log(index);

            setSelectedOption(item);
            pagerRef.current?.setPageWithoutAnimation(index);
          }}
        />

        {
          <PagerView
            ref={pagerRef}
            scrollEnabled={false}
            initialPage={category === "Calendar" ? 0 : 1}
            style={{ flex: 1 }}
            offscreenPageLimit={2}
            overdrag={true}
          >
            <View key="calendar" style={{ flex: 1 }}>
              <CalenderAnalytics habitId={id as string} />
            </View>
            <View key="stats" style={{ flex: 1 }}>
              <StatisticsAnalytics
                habitId={id as string}
                habitHasEndDate={
                  getHabitDetailsQuery?.data?.end_date ? true : false
                }
              />
            </View>
          </PagerView>
        }
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Analytics;
