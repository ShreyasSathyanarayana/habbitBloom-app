import { fetchMonthlyHabitProgressForYear } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { getCurrentMonthAndYear } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import YearGraph from "./year-graph";
import ScrollArrow from "@/components/ui/scroll-arrow";
import moment from "moment";
type Props = {
  habitId: string;
};
const ITEM_WIDTH = horizontalScale(60);
const ITEM_Size = horizontalScale(40);
const MontlyGraph = ({ habitId }: Props) => {
  const { month, year } = getCurrentMonthAndYear();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getMonthlyGraphQuery = useQuery({
    queryKey: ["monthly", habitId],
    queryFn: () => fetchMonthlyHabitProgressForYear(habitId),
  });
  //   console.log("monthly", JSON.stringify(getMonthlyGraphQuery.data, null, 2));
  useEffect(() => {
    if (flatListRef.current && getMonthlyGraphQuery?.data) {
      const currentWeekIndex = moment().get("M");
      setCurrentIndex(currentWeekIndex ?? 0);
      setTimeout(() => {
        flatListRef?.current?.scrollToOffset({
          offset: currentWeekIndex * ITEM_WIDTH,
          animated: true,
          // viewPosition: 1,
        });
      }, 1000);
    }
  }, [getMonthlyGraphQuery.data]);
  return (
    <View
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
            dataLength={getMonthlyGraphQuery.data?.length ?? 0}
          />
          <ScrollArrow
            direction="right"
            flatListRef={flatListRef}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            itemWidth={ITEM_WIDTH}
            dataLength={getMonthlyGraphQuery.data?.length ?? 0}
          />
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        horizontal
        contentContainerStyle={{
          paddingTop: verticalScale(16),
        }}
        scrollEventThrottle={16}
        data={getMonthlyGraphQuery?.data}
        keyExtractor={(_, index) => index.toString() + "weekDetails"}
        renderItem={({ item, index }) => {
          return (
            <YearGraph
              date={item.month}
              completed={item.completed}
              total={30}
              lastIndex={
                index === (getMonthlyGraphQuery?.data ?? []).length - 1
              }
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default MontlyGraph;
