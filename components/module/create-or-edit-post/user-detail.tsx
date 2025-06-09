import { getUserProfile } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "../streaks/ui/avatar";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";

const UserDetail = () => {
  const getUserDetailsQuery = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => {
      return getUserProfile();
    },
    networkMode: "online",
  });
//   console.log(
//     "getUserDetailsQuery",
//     JSON.stringify(getUserDetailsQuery.data, null, 2)
//   );

  return (
    <View style={styles.container}>
      <Avatar uri={getUserDetailsQuery.data?.profile_pic} />
      <ThemedText>{getUserDetailsQuery.data?.full_name}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    // paddingBottom: verticalScale(16),
  },
});

export default UserDetail;
