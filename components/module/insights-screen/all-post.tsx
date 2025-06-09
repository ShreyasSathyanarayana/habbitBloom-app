import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import EmptyPost from "./empty-post";
import { usePosts } from "./useAllPost";
import PostCard from "../insights/post-card";
import { Divider } from "@rneui/base";
import { verticalScale } from "@/metric";
import { RefreshControl } from "react-native-gesture-handler";

const AllPost = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = usePosts();

  console.log("data", JSON.stringify(data?.pages?.flat(), null, 2));

  if (data?.pages?.length == 0) {
    // Replace with No posts condition
    return <EmptyPost />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: verticalScale(16),
          paddingBottom: verticalScale(100),
        }}
        keyExtractor={(item) => item.id}
        data={data?.pages?.flat()}
        renderItem={({ item }) => {
          return <PostCard {...item} />;
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
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
