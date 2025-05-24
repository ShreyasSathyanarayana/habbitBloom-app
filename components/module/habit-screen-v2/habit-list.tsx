import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { HabitCardProp, HabitListProps } from "./type";
import { LegendList } from "@legendapp/list";
import HabitCard from "./habit-card";
import { verticalScale } from "@/metric";
import { Skeleton } from "moti/skeleton";

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
  const renderItem = useCallback(({ item }: { item: HabitCardProp }) => {
    return <HabitCard {...item} />;
  }, []);

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
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          keyExtractor={(item, index) => "AllHabitList" + index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          renderItem={() => (
            <Skeleton width={"100%"} height={verticalScale(250)} />
          )}
          onEndReachedThreshold={0.6}
        />
      </View>
    );
  }

  return (
    <View key={"HabitList"} style={styles.container}>
      <FlatList
        data={habitList ?? []}
        keyExtractor={(_, index) => "HabitCard" + index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: verticalScale(16) }} />
        )}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        scrollEventThrottle={16}
        onEndReached={onScrollEnd}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          isFetchingNextPage && isNextPageAvailable ? (
            <ActivityIndicator
              color={"#8A2BE2"}
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(16),
  },
});

export default HabitList;
