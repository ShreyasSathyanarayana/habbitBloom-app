import ProfileSheetOptionButton from "@/components/module/profile/ui/profile-sheet-option-button";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import CameraIcon from "@/assets/svg/camera-logo.svg";
import GalleryIcon from "@/assets/svg/gallery-logo.svg";
import AvatarIcon from "@/assets/svg/avatar-logo.svg";
import DeleteIcon from "@/assets/svg/delete-logo.svg";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { horizontalScale, verticalScale } from "@/metric";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  pickImage,
  takePhoto,
  uploadProfileImage,
} from "@/camera-function/camera-picker";
import { updateProfilePic } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
import { useProfileStore } from "@/store/profile-store";
const _iconSize = horizontalScale(24);
const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const closeSheet = () => {
  SheetManager.hide("profile-pic");
};

const ProfilePicSheet = (props: SheetProps<"profile-pic">) => {
  const payload = props.payload;
  const toast = useToast();
  const setProfilePicLoading = useProfileStore((state) => state.setLoading);
  const queryClient = useQueryClient();
  const pickerMutation = useMutation({
    mutationKey: ["profile-pic-picker"],
    mutationFn: async () => {
      const image = await pickImage();
      // console.log("Image picked:", image?.uri);

      if (image) {
        closeSheet();
        setProfilePicLoading(true);

        if (image.fileSize && image.fileSize > MAX_FILE_SIZE_BYTES) {
          console.warn(
            `File too large: ${image.fileSize} bytes. Limit is ${MAX_FILE_SIZE_BYTES} bytes.`
          );
          toast.show("File size exceeds the limit of 3MB", {
            type: "warning",
          });
          return null;
        }
        const profilePic = await uploadProfileImage(image);
        const profilePicUrl = await updateProfilePic(profilePic, false);
        queryClient.invalidateQueries({ queryKey: ["userDetails"] });
        // setProfilePicLoading(false);
        // toast.show("Profile picture updated successfully", {
        //   type: "success",
        // });
      }
    },
    onError: (error) => {
      console.error("Error uploading profile picture:", error);
      toast.show("Failed to update profile picture", {
        type: "danger",
      });
    },
    onSettled: () => {
      setTimeout(() => {
        setProfilePicLoading(false);
      }, 1000);
    },
  });

  const cameraMutation = useMutation({
    mutationKey: ["profile-pic-camera"],
    mutationFn: async () => {
      const image = await takePhoto();
      if (image) {
        closeSheet();
        setProfilePicLoading(true);
        if (image.fileSize && image.fileSize > MAX_FILE_SIZE_BYTES) {
          console.warn(
            `File too large: ${image.fileSize} bytes. Limit is ${MAX_FILE_SIZE_BYTES} bytes.`
          );
          toast.show("File size exceeds the limit of 3MB", {
            type: "warning",
          });
          return null;
        }
        const profilePic = await uploadProfileImage(image);
        const profilePicUrl = await updateProfilePic(profilePic, false);
        queryClient.invalidateQueries({ queryKey: ["userDetails"] });
        // setProfilePicLoading(false);
        // toast.show("Profile picture updated successfully", {
        //   type: "success",
        // });
      }
    },
    onError: (error) => {
      console.error("Error uploading profile picture:", error);
      toast.show("Failed to update profile picture", {
        type: "danger",
      });
    },
    onSettled: () => {
      setTimeout(() => {
        setProfilePicLoading(false);
      }, 1000);
    },
  });

  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      {/* {(showAvatarSection || !payload?.profile_pic) && (
        <AvatarSection currentProfilePic={payload?.profile_pic ?? null} />
      )} */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingVertical: verticalScale(24),
        }}
      >
        <ProfileSheetOptionButton
          icon={<CameraIcon height={_iconSize} width={_iconSize} />}
          label="Camera"
          onPress={() => {
            cameraMutation.mutate();
          }}
        />
        <ProfileSheetOptionButton
          icon={<GalleryIcon height={_iconSize} width={_iconSize} />}
          label="Gallery"
          onPress={() => {
            pickerMutation.mutate();
          }}
        />

        <ProfileSheetOptionButton
          icon={<AvatarIcon height={_iconSize} width={_iconSize} />}
          label="Avatar"
          onPress={() => {
            // setShowAvatarSection(true);
            closeSheet();
            router.push(
              `/(protected)/change-profile-pic?profilePic=${
                payload?.profile_pic ?? null
              }`
            );
          }}
        />
        <ProfileSheetOptionButton
          icon={<DeleteIcon height={_iconSize} width={_iconSize} />}
          label="Remove"
          onPress={() => {
            SheetManager.show("delete-profile-pic");
          }}
        />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default ProfilePicSheet;
