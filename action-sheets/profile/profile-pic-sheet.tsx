import ProfileSheetOptionButton from "@/components/module/profile/ui/profile-sheet-option-button";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { ThemedText } from "@/components/ui/theme-text";
import CameraIcon from "@/assets/svg/camera-logo.svg";
import GalleryIcon from "@/assets/svg/gallery-logo.svg";
import AvatarIcon from "@/assets/svg/avatar-logo.svg";
import DeleteIcon from "@/assets/svg/delete-logo.svg";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { horizontalScale, verticalScale } from "@/metric";
import AvatarSection from "@/components/module/profile/avatar-section";
const _iconSize = horizontalScale(24);

const ProfilePicSheet = (props: SheetProps<"profile-pic">) => {
  const payload = props.payload;
  const [showAvatarSection, setShowAvatarSection] = useState(false);

  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      {(showAvatarSection || !payload?.profile_pic) && (
        <AvatarSection currentProfilePic={payload?.profile_pic ?? null} />
      )}
      {(payload?.profile_pic && !showAvatarSection) && ( //check if profile pic exist then show this section
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingVertical: verticalScale(24),
          }}
        >
          {/* <ProfileSheetOptionButton
          icon={<CameraIcon height={_iconSize} width={_iconSize} />}
          label="Camera"
          onPress={() => {
            console.log("");
          }}
        />
        <ProfileSheetOptionButton
          icon={<GalleryIcon height={_iconSize} width={_iconSize} />}
          label="Gallery"
          onPress={() => {
            console.log("");
          }}
        /> */}

          <ProfileSheetOptionButton
            icon={<AvatarIcon height={_iconSize} width={_iconSize} />}
            label="Avatar"
            onPress={() => {
              setShowAvatarSection(true);
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
      )}
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default ProfilePicSheet;
