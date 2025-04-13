import { deleteSuggestionByAdmin, getAllSuggestions } from "@/api/api";
import EmptySuggestion from "@/components/module/suggestion/empty-suggestion";
import { statusMap } from "@/components/module/suggestion/ui/status";
import StatusList from "@/components/module/suggestion/ui/status-list";
import SuperSuggestionCard from "@/components/module/super-suggestion/super-suggestion-card";
import Container from "@/components/ui/container";
import Divider from "@/components/ui/divider";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { horizontalScale, verticalScale } from "@/metric";
import { statusValues, suggestionCategoryValues } from "@/utils/constants";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

const Index = () => {
  const limit = 10;
  const toast = useToast();
  const queryclient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const getAllSuggestionQuery = useInfiniteQuery({
    queryKey: ["getAllSuggestion", selectedStatus],
    queryFn: ({ pageParam }) => {
      return getAllSuggestions(pageParam, limit, selectedStatus);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      if (lastPage?.length < limit) {
        return undefined;
      }
      return nextPage;
    },
  });
  // console.log(
  //   "All Suggestion==>",
  //   JSON.stringify(getAllSuggestionQuery.data, null, 2)
  // );
  const deleteSuggestionMutation = useMutation({
    mutationKey: ["deleteSuggestion"],
    mutationFn: (id: string) => {
      return deleteSuggestionByAdmin(id);
    },
    onSuccess: () => {
      toast.show("Deleted Successfully", {
        type: "success",
      });
      queryclient.invalidateQueries({ queryKey: ["getAllSuggestion"] });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });

  return (
    <Container>
      <Header title="Suggestion Received" />
      <View style={styles.container}>
        <View
          style={{
            padding: horizontalScale(16),
            paddingBottom: horizontalScale(6),
            gap: verticalScale(16),
          }}
        >
          <StatusList
            selectedValue={selectedStatus}
            data={statusValues}
            keyName="StatusList"
            onClick={(value) => setSelectedStatus(value)}
          />
          {/* <StatusList
            selectedValue={selectedCategory}
            data={suggestionCategoryValues}
            keyName="categoryList"
            onClick={(value) => setSelectedCategory(value)}
          /> */}
        </View>
        {getAllSuggestionQuery?.isLoading && <Loading />}
        {getAllSuggestionQuery?.data?.pages?.flat().length === 0 &&
          !getAllSuggestionQuery?.isLoading && <EmptySuggestion />}
        {(getAllSuggestionQuery?.data?.pages?.flat().length ?? 0) > 0 &&
          !getAllSuggestionQuery?.isLoading && (
            <FlatList
              data={getAllSuggestionQuery.data?.pages?.flat()}
              keyExtractor={(_, index) => index.toString() + "All Suggestion"}
              renderItem={({ item }) => (
                <SuperSuggestionCard
                  {...item}
                  handleDelete={(id) =>
                    deleteSuggestionMutation?.mutateAsync(id)
                  }
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={
                    !getAllSuggestionQuery?.isLoading &&
                    getAllSuggestionQuery?.isRefetching
                  }
                  onRefresh={getAllSuggestionQuery?.refetch}
                  colors={["#8A2BE2"]} // Android spinner color
                  tintColor="white" // iOS spinner color
                />
              }
              ItemSeparatorComponent={() => (
                <Divider
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    marginHorizontal: horizontalScale(16),
                  }}
                />
              )}
              scrollEventThrottle={16}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (getAllSuggestionQuery?.hasNextPage) {
                  getAllSuggestionQuery?.fetchNextPage();
                }
              }}
              ListFooterComponent={
                getAllSuggestionQuery?.isFetchingNextPage &&
                getAllSuggestionQuery?.hasNextPage ? (
                  <ActivityIndicator
                    color={"#8A2BE2"}
                    style={{ marginVertical: 16 }}
                  />
                ) : null
              }
            />
          )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: horizontalScale(16),
  },
});

export default Index;
