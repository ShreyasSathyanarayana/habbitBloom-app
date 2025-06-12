import { getOtherUserHabits, getOtherUserProfile } from "@/api/api";
import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import ServerError from "@/components/module/errors/server-error";
import HabitTrackList from "@/components/module/other-user-view/habit-track-list";
import PostList from "@/components/module/other-user-view/post-list";
import ProfilePic from "@/components/module/other-user-view/ui/profile-pic";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
const MENU_OPTIONS = ["All Posts ", "My Posts"];

const Index = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const pagerRef = React.useRef<PagerView>(null);
  const [selectedMenu, setSelectedMenu] = React.useState(MENU_OPTIONS[0]);

  const onChangeMenu = useCallback((item: string, index: number) => {
    setSelectedMenu(item);
    pagerRef.current?.setPageWithoutAnimation(index);
  }, []);
  //   console.log("userId", userId);
  const otherUserDetailsQuery = useQuery({
    queryKey: ["otherUserDetails", userId],
    queryFn: () => getOtherUserProfile(userId as string),
  });

  const otherUserHabitTrackQuery = useQuery({
    queryKey: ["otherUserHabitTrack", userId],
    queryFn: () => getOtherUserHabits(userId as string),
  });

  const onRefreshPage = () => {
    otherUserDetailsQuery.refetch();
    otherUserHabitTrackQuery.refetch();
  };

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
  if (
    otherUserDetailsQuery?.status == "error" ||
    otherUserHabitTrackQuery?.status == "error"
  ) {
    return <ServerError onRefresh={onRefreshPage} />;
  }

  return (
    <Container>
      <Header title={otherUserDetailsQuery?.data?.full_name ?? ""} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      >
        <ProfilePic
          userDetails={otherUserDetailsQuery?.data}
          isLoading={otherUserDetailsQuery.isLoading}
        />
        <AnalyticsBar
          menu={MENU_OPTIONS}
          selectedMenu={selectedMenu}
          onChangeMenu={onChangeMenu}
        />

        {selectedMenu === MENU_OPTIONS[0] && <PostList userId={userId ?? ""} />}

        {selectedMenu === MENU_OPTIONS[1] && (
          <HabitTrackList
            habits={otherUserHabitTrackQuery?.data ?? []}
            isLoading={otherUserHabitTrackQuery.isLoading}
          />
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: horizontalScale(16),
    gap: verticalScale(24),
  },
});

export default Index;
