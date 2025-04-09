import { getUserProfile } from "@/api/api";
import NoInternet from "@/components/module/errors/no-internet";
import ServerError from "@/components/module/errors/server-error";
import ProfileBody from "@/components/module/profile/profile-body";
import ProfileHead from "@/components/module/profile/profile-head";
import { useAuth } from "@/context/AuthProvider";
import { verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const { isConnected } = useAuth();
  const getUserDetailsQuery = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => {
      return getUserProfile();
    },
    networkMode: "online",
  });
  if (!isConnected) {
    return <NoInternet onRefresh={() => getUserDetailsQuery?.refetch()} />;
  }

  if (getUserDetailsQuery?.status === "error") {
    return <ServerError onRefresh={() => getUserDetailsQuery?.refetch()} />;
  }

  const profileData = getUserDetailsQuery.data;
  // console.log("profileData", JSON.stringify(profileData, null, 2));

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
      }}
    >
      <ProfileHead {...profileData} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
      >
        <ProfileBody />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Profile;
