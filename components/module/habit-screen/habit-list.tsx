import React, { memo, useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import HabitCard, { HabitProp } from "./habit-card";
import { verticalScale } from "@/metric";
import { SharedValue } from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import { FlashList, useBlankAreaTracker } from "@shopify/flash-list";
import HabitEmpty from "./habit-empty";
import { LegendList } from "@legendapp/list";

export type HabitListProps = {
  scrollY: SharedValue<number>;
  habitList?: HabitProp[];
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onScrollEnd: () => void;
  isNextPageAvailable: boolean;
  isFetchingNextPage: boolean;
};

const HabitList = ({
  scrollY,
  isLoading,
  habitList,
  onRefresh,
  isRefreshing,
  onScrollEnd,
  isNextPageAvailable,
  isFetchingNextPage,
}: HabitListProps) => {
  const memoizedHabits = useMemo(() => habitList, [habitList]);
  const MemoizedHabitCard = memo(HabitCard);
  const ref = useRef(null);

  const renderItem = useCallback(({ item }: { item: HabitProp }) => {
    return <MemoizedHabitCard {...item} />;
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
          estimatedItemSize={50}
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
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {memoizedHabits && memoizedHabits.length > 0 && (
        <LegendList
          key={"habit-list"}
          onRefresh={onRefresh}
          ref={ref}
          data={memoizedHabits}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={isRefreshing}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          onScroll={handleScroll}
          // recycleItems
          // onBlankArea={onBlankArea}
          ItemSeparatorComponent={() => {
            return <View style={{ height: verticalScale(16) }} />;
          }}
          onEndReachedThreshold={0.8}
          onEndReached={isNextPageAvailable ? onScrollEnd : null}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#8A2BE2"]} // Android spinner color
              tintColor="#8A2BE2" // iOS spinner color
            />
          }
          ListFooterComponent={
            isFetchingNextPage && isNextPageAvailable ? (
              <ActivityIndicator
                color={"#8A2BE2"}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          // ListEmptyComponent={HabitEmpty}
        />
      )}
      {!isLoading && memoizedHabits?.length === 0 && <HabitEmpty />}
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
