import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import HabitCard, { HabitProp } from "./habit-card";
import { verticalScale } from "@/metric";
import { SharedValue } from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import { FlashList } from "@shopify/flash-list";
import HabitEmpty from "./habit-empty";

type Props = {
  scrollY: SharedValue<number>;
  habitList?: HabitProp[];
  isLoading: boolean;
};

const HabitList = ({ scrollY, isLoading, habitList }: Props) => {
  const memoizedHabits = useMemo(() => habitList, [habitList]);

  const renderItem = useCallback(({ item }: { item: HabitProp }) => {
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
        <FlashList
          estimatedItemSize={250}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          renderItem={() => (
            <Skeleton width={"100%"} height={verticalScale(250)} />
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {memoizedHabits && memoizedHabits.length > 0 && (
        <FlashList
          data={memoizedHabits}
          getItemType={(item) => item.id}
          onScroll={handleScroll}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          estimatedItemSize={250}

          // ListEmptyComponent={()=><HabitEmpty/>}
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
