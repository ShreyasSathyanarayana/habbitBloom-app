import { getOtherUserHabits, getOtherUserProfile } from "@/api/api";
import HabitTrackList from "@/components/module/other-user-view/habit-track-list";
import ProfilePic from "@/components/module/other-user-view/ui/profile-pic";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Index = () => {
  const { userId } = useLocalSearchParams();
  //   console.log("userId", userId);
  const otherUserDetailsQuery = useQuery({
    queryKey: ["otherUserDetails", userId],
    queryFn: () => getOtherUserProfile(userId as string),
  });

  const otherUserHabitTrackQuery = useQuery({
    queryKey: ["otherUserHabitTrack", userId],
    queryFn: () => getOtherUserHabits(userId as string),
  });

  //   console.log(
  //     "otherUserDetailsQuery",
  //     JSON.stringify(otherUserHabitTrackQuery?.data, null, 2)
  //   );

  //   if (otherUserDetailsQuery.isLoading) {
  //     return null;
  //   }
  //   if (!otherUserDetailsQuery.data) {
  //     return null;
  //   }

  return (
    <Container>
      <Header title={otherUserDetailsQuery?.data?.full_name ?? ""} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {otherUserDetailsQuery?.data && (
            <ProfilePic {...otherUserDetailsQuery.data} />
          )}
          <HabitTrackList habits={otherUserHabitTrackQuery?.data ?? []} />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: horizontalScale(16),
    gap: verticalScale(24),
  },
});

export default Index;
