import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileHeadContainer from "./ui/profile-head-container";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { IsoDateUtils } from "@/utils/constants";
import ProfilePic from "./profile-pic";
import { SheetManager } from "react-native-actions-sheet";
import { getUserRole, isUserSubscribed } from "@/utils/persist-storage";
import { useProfileStore } from "@/store/profile-store";
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
  const isSubscribed = isUserSubscribed();
  const isProfilePicLoading = useProfileStore((state) => state.isLoading);
  return (
    <ProfileHeadContainer>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            SheetManager.show("update-profile-info", {
              payload: {
                id: props.id,
                full_name: props.full_name,
                profile_bio: props.profile_bio,
              },
            })
          }
          style={{ padding: horizontalScale(5) }}
        >
          <ThemedText style={{ fontSize: getFontSize(14) }}>Edit</ThemedText>
        </TouchableOpacity>
      </View>
      <View
        style={{ alignItems: "center", width: "100%", gap: verticalScale(16) }}
      >
        <ProfilePic
          isLoading={isProfilePicLoading}
          profilePic={props?.profile_pic}
          isSubscribed={isSubscribed}
        />
        <ThemedText
          numberOfLines={2}
          style={{ fontFamily: "PoppinsSemiBold", textAlign: "center" }}
        >
          {props?.full_name ?? ""}
        </ThemedText>
        {props?.profile_bio && (
          <ThemedText
            style={{ textAlign: "center", fontSize: getFontSize(14) }}
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
