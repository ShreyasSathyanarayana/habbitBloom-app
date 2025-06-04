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
import { useLocalSearchParams } from "expo-router";
import PagerView from "react-native-pager-view";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const MENU_OPTIONS = ["Calendar", "Statistics"];

const Analytics = () => {
  const {
    id,
    category,
    otherUserView, // this will be used to determine if the view is for another user
    // if otherUserView is present, we can handle the logic accordingly
  } = useLocalSearchParams<{
    id: string;
    category: string;
    otherUserView?: string;
  }>();
  const pagerRef = useRef<PagerView>(null);
  const { isConnected } = useAuth();

  const [selectedMenu, setSelectedMenu] = useState(category);

  const {
    data: habit,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["habitDetails", id],
    queryFn: () => getHabitById(id),
    enabled: Boolean(id),
  });

  const CategoryIcon = useMemo(() => {
    return getCategoryByName(habit?.category ?? "");
  }, [habit?.category]);

  const onChangeMenu = useCallback((item: string, index: number) => {
    setSelectedMenu(item);
    pagerRef.current?.setPageWithoutAnimation(index);
  }, []);

  if (!isConnected) {
    return <NoInternet onRefresh={refetch} />;
  }

  // console.log("Other User View:", Boolean(otherUserView));
  

  return (
    <Container>
      <AnalyticsHeader
        headerIcon={CategoryIcon}
        isLoading={isLoading}
        title={habit?.habit_name ?? ""}
      />

      <View style={styles.contentContainer}>
        <AnalyticsBar
          menu={MENU_OPTIONS}
          selectedMenu={selectedMenu}
          onChangeMenu={onChangeMenu}
        />

        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={selectedMenu === "Calendar" ? 0 : 1}
          offscreenPageLimit={2}
          scrollEnabled={false}
        >
          <View key="calendar" style={styles.page}>
            <CalenderAnalytics habitId={id} />
          </View>
          <View key="statistics" style={styles.page}>
            <StatisticsAnalytics
              otherUser={Boolean(otherUserView)}
              habitName={habit?.habit_name ?? ""}
              habitId={id}
              habitHasEndDate={Boolean(habit?.end_date)}
            />
          </View>
        </PagerView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(24),
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});

export default Analytics;
