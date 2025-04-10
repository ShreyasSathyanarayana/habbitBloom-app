import { fetchWeeklyHabitProgressForYear } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { getCurrentMonthAndYear, getCurrentWeekIndex } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import YearGraph from "./year-graph";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import ScrollArrow from "@/components/ui/scroll-arrow";
type Props = {
  habitId: string;
};
const ITEM_WIDTH = horizontalScale(60);

const WeeklyGraph = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getWeeklyQuery = useQuery({
    queryKey: ["weekly", habitId],
    queryFn: () => {
      return fetchWeeklyHabitProgressForYear(habitId);
    },
    enabled: !!habitId,
  });

  // console.log("weekly", JSON.stringify(getWeeklyQuery.data, null, 2));

  useEffect(() => {
    const data = getWeeklyQuery?.data;
    if (flatListRef.current && data?.length) {
      const currentWeekIndex = getCurrentWeekIndex(data);

      if (typeof currentWeekIndex === "number") {
        setCurrentIndex(currentWeekIndex);

        const timeoutId = setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: currentWeekIndex * ITEM_WIDTH,
            animated: true,
          });
        }, 100);

        // Cleanup timeout when component unmounts or data changes
        return () => clearTimeout(timeoutId);
      }
    }
  }, [getWeeklyQuery?.data]);

  if (getWeeklyQuery?.isLoading) {
    return <Skeleton width={"100%"} height={verticalScale(54)} />;
  }

  return (
    <View
      key={"weekly-graph"}
      style={{
        paddingVertical: verticalScale(16),
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ThemedText
          style={{ fontSize: getFontSize(17), fontFamily: "PoppinsSemiBold" }}
        >
          {month} {year}
        </ThemedText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(16),
          }}
        >
          <ScrollArrow
            direction="left"
            flatListRef={flatListRef}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            itemWidth={ITEM_WIDTH}
            dataLength={getWeeklyQuery.data?.length ?? 0}
          />
          <ScrollArrow
            direction="right"
            flatListRef={flatListRef}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            itemWidth={ITEM_WIDTH}
            dataLength={getWeeklyQuery.data?.length ?? 0}
          />
        </View>
      </View>
      <FlatList
        horizontal
        contentContainerStyle={{
          paddingTop: verticalScale(16),
        }}
        initialNumToRender={7}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref={flatListRef}
        scrollEventThrottle={16}
        data={getWeeklyQuery.data}
        keyExtractor={(_, index) => index.toString() + "weekDetails"}
        renderItem={({ item, index }) => {
          return (
            <YearGraph
              date={item.week}
              completed={item.completed}
              total={7}
              lastIndex={
                index === (getWeeklyQuery?.data?.length ?? 0) - 1 ? true : false
              }
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default WeeklyGraph;
