import { ThemedText } from "@/components/ui/theme-text";
import React, { memo, useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import EmptyPost from "./empty-post";
import { usePosts } from "./useAllPost";
import PostCard from "../insights/post-card";
import { Divider } from "@rneui/base";
import { verticalScale } from "@/metric";
import { RefreshControl } from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useTabBar } from "@/context/TabBarContext";

const SCROLL_HIDE_THRESHOLD = 10;
const SCROLL_SHOW_THRESHOLD = -5;

const AllPost = () => {
  const { showTabBar, hideTabBar } = useTabBar();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = usePosts();

  // console.log("data", JSON.stringify(data?.pages?.flat(), null, 2));

  useDerivedValue(() => {
    const deltaY = scrollY.value - prevScrollY.value;
    if (deltaY > SCROLL_HIDE_THRESHOLD) runOnJS(hideTabBar)();
    else if (deltaY < SCROLL_SHOW_THRESHOLD) runOnJS(showTabBar)();
    prevScrollY.value = scrollY.value;
  }, []);

  if (data?.pages?.length == 0) {
    // Replace with No posts condition
    return <EmptyPost />;
  }

  const posts = useMemo(() => data?.pages?.flat() ?? [], [data]);

  const MemoizedPostCard = memo(PostCard);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <MemoizedPostCard {...item} />,
    []
  );

  const handleScroll = useCallback(
    (e: any) => {
      scrollY.value = e.nativeEvent.contentOffset.y;
    },
    [scrollY]
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        key={"all-post-list"}
        onScroll={handleScroll}
        itemLayoutAnimation={LinearTransition}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: verticalScale(16),
          paddingBottom: verticalScale(100),
        }}
        keyExtractor={(item) => item.id}
        data={posts}
        renderItem={renderItem}
        onEndReached={onEndReached}
        initialNumToRender={5}
        // windowSize={10}
        // maxToRenderPerBatch={5}
        ItemSeparatorComponent={() => (
          <Divider
            color="rgba(255, 255, 255, 0.18)"
            style={{ marginVertical: verticalScale(16) }}
          />
        )}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#888" />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AllPost;
