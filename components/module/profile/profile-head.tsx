import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileHeadContainer from "./ui/profile-head-container";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { IsoDateUtils } from "@/utils/constants";
import ProfilePic from "./profile-pic";
type UserProfile = {
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  created_at: string; // Consider using Date if it's a date
  updated_at: string; // Consider using Date if it's a date
  profile_pic: string; // Can be a URL or "NULL" string
  profile_bio: string; // Can be a string or "NULL"
};

const ProfileHead = (props: UserProfile) => {
  return (
    <ProfileHeadContainer>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity style={{ padding: horizontalScale(5) }}>
          <ThemedText style={{ fontSize: getFontSize(14) }}>Edit</ThemedText>
        </TouchableOpacity>
      </View>
      <View
        style={{ alignItems: "center", width: "100%", gap: verticalScale(16) }}
      >
        <ProfilePic profilePic={props?.profile_pic} isSubscribed={true} />
        <ThemedText
          numberOfLines={2}
          style={{ fontFamily: "PoppinsSemiBold", textAlign: "center" }}
        >
          {props?.full_name ?? ""}
        </ThemedText>
        {props?.profile_bio && (
          <ThemedText
            style={{ fontFamily: "PoppinsMedium", textAlign: "center" }}
          >
            {props.profile_bio}
          </ThemedText>
        )}
        {props?.created_at && (
          <ThemedText
            style={{
              fontSize: getFontSize(10),
              color: "rgba(179, 179, 179, 1)",
            }}
          >
            Account Created :{" "}
            {IsoDateUtils.convertToLocalDate(props.created_at, "MMM D, YYYY")}
          </ThemedText>
        )}
      </View>
    </ProfileHeadContainer>
  );
};

const styles = StyleSheet.create({});

export default ProfileHead;
