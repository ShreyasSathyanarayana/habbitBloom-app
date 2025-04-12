import { deleteSuggestionById, getMySuggestions } from "@/api/api";
import SuggestionCard from "@/components/module/suggestion/suggestion-card";
import Container from "@/components/ui/container";
import Divider from "@/components/ui/divider";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import PlusIcon from "@/assets/svg/add-icon.svg";
import { useToast } from "react-native-toast-notifications";
import EmptySuggestion from "@/components/module/suggestion/empty-suggestion";
const _iconSize = horizontalScale(24);
const Index = () => {
  const mySuggestionQuery = useQuery({
    queryKey: ["mySuggestion"],
    queryFn: () => {
      return getMySuggestions();
    },
  });
  // console.log(
  //   "mySuggestionQuery",
  //   JSON.stringify(mySuggestionQuery.data, null, 2)
  // );
  const queryclient = useQueryClient();
  const toast = useToast();
  const deleteMutation = useMutation({
    mutationKey: ["deleteSuggestion"],
    mutationFn: (id: string) => {
      return deleteSuggestionById(id);
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["mySuggestion"] });
    },
    onError: () => {
      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });

  return (
    <Container>
      <Header
        title="Suggestion List"
        rightIcon={
          <TouchableOpacity
            // style={{ padding: horizontalScale(5) }}
            onPress={() =>
              router.push("/(protected)/suggestion/create-suggestion")
            }
          >
            <PlusIcon width={_iconSize} height={_iconSize} />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {mySuggestionQuery?.data?.length == 0 ? (
          <EmptySuggestion />
        ) : (
          <FlatList
            data={mySuggestionQuery?.data}
            keyExtractor={(_, index) => index.toString() + "SuggestionList"}
            renderItem={({ item }) => {
              return (
                <SuggestionCard
                  {...item}
                  handleDelete={(id) => deleteMutation.mutateAsync(id)}
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <Divider
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  marginHorizontal: horizontalScale(16),
                }}
              />
            )}
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
