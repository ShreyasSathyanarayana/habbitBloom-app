import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useMyPosts } from "../insights-screen/useCurrentUserPost";
import EmptyPost from "../insights-screen/empty-post";
import { verticalScale } from "@/metric";
import { Divider } from "@rneui/base";
import PostCard from "../insights/post-card";
import Animated, { LinearTransition } from "react-native-reanimated";
import { FlatList } from "react-native";

type Props = {
  userId: string;
};

const PostList = ({ userId }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useMyPosts({ userId: userId ?? "" });

  if (data?.pages?.length == 0) {
    // Replace with No posts condition
    return <EmptyPost />;
  }
  return (
    <FlatList
      key={"all-post-list"}
      // itemLayoutAnimation={LinearTransition}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(100),
      }}
      scrollEnabled={false}
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
  );
};

const styles = StyleSheet.create({});

export default PostList;
