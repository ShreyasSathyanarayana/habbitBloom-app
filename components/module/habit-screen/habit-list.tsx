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

type Props = {
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
}: Props) => {
  const memoizedHabits = useMemo(() => habitList, [habitList]);
  const MemoizedHabitCard = memo(HabitCard);
  const ref = useRef(null);
  const [blankAreaTrackerResult, onBlankArea] = useBlankAreaTracker(ref);

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
        <FlashList
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
          scrollEventThrottle={16}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {memoizedHabits && memoizedHabits.length > 0 && (
        <FlatList
          onRefresh={onRefresh}
          ref={ref}
          data={memoizedHabits}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={isRefreshing}
          initialNumToRender={3}
          getItemLayout={(data, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
          // estimatedItemSize={80} // Adjust based on UI
          // windowSize={5} // Increase for better scrolling performance
          // maxToRenderPerBatch={5} // Adjust this based on testing
          // updateCellsBatchingPeriod={50}
          // removeClippedSubviews={true}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          // onBlankArea={onBlankArea}
          ItemSeparatorComponent={() => {
            return <View style={{ height: verticalScale(16) }} />;
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (isNextPageAvailable) {
              onScrollEnd();
            }
          }}
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
