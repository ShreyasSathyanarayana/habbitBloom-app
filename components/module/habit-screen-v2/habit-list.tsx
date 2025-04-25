import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { HabitCardProp, HabitListProps } from "./type";
import { ThemedText } from "@/components/ui/theme-text";
import { LegendList } from "@legendapp/list";
import HabitCard from "./habit-card";
import { verticalScale } from "@/metric";
import { ActivityIndicator } from "react-native";
import { Skeleton } from "moti/skeleton";
import { RefreshControl } from "react-native";

const HabitList = ({
  isFetchingNextPage,
  isLoading,
  isNextPageAvailable,
  isRefreshing,
  onRefresh,
  onScrollEnd,
  scrollY,
  habitList,
}: HabitListProps) => {
  // console.log("habitList", JSON.stringify(habitList, null, 2));

  const renderItem = useCallback(({ item }: { item: HabitCardProp }) => {
    return <HabitCard {...item} />;
  }, []);

  // this is for animations
  const handleScroll = useCallback(
    (e: any) => {
      scrollY.value = e.nativeEvent.contentOffset.y;
    },
    [scrollY]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LegendList
          key={"loading"}
          // estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          keyExtractor={(item, index) => "AllHabitList" + index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          renderItem={() => (
            <Skeleton width={"100%"} height={verticalScale(250)} />
          )}
          // scrollEventThrottle={16}
          onEndReachedThreshold={0.6}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LegendList
        onScroll={handleScroll}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        data={habitList ?? []}
        keyExtractor={(_, index) => "HabitCard" + index?.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: verticalScale(16) }} />
        )}
        // scrollEventThrottle={16}
        onEndReached={onScrollEnd}
        ListFooterComponent={
          isFetchingNextPage && isNextPageAvailable ? (
            <ActivityIndicator
              color={"#8A2BE2"}
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(16),
    // paddingBottom: verticalScale(100),
    // backgroundColor: "red",
  },
});

export default HabitList;
