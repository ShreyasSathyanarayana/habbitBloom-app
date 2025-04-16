import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import AvatarImage from "./avatar-image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvatarImages, updateProfilePic } from "@/api/api";
import { FlatList, SheetManager } from "react-native-actions-sheet";
import AlertButton from "@/action-sheets/alert-button";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";
import { getUserRole, isUserSubscribed } from "@/utils/persist-storage";

type Props = {
  currentProfilePic: string | null;
};
const closeSheet = () => {
  // SheetManager.hide("profile-pic");
  router.back();
};

const AvatarSection = ({ currentProfilePic }: Props) => {
  // const role = getUserRole();
  const isSubscribed = isUserSubscribed();
  const queryClient = useQueryClient();
  const toast = useToast();
  const getAvatarImagesQuery = useQuery({
    queryKey: ["getAvatarImages"],
    queryFn: () => getAvatarImages(),
  });
  // console.log(
  //   "getAvatarImagesQuery",
  //   JSON.stringify(getAvatarImagesQuery.data, null, 2)
  // );
  const [profilePic, setProfilePic] = React.useState<string | null>(
    currentProfilePic
  );

  useEffect(() => {
    // If currentProfilePic is a valid URL
    if (currentProfilePic) {
      setProfilePic(currentProfilePic);
    }
    // If currentProfilePic is null and avatar images have been loaded
    else if (
      !currentProfilePic &&
      getAvatarImagesQuery?.data?.[0]?.avatar_url
    ) {
      setProfilePic(getAvatarImagesQuery.data[0].avatar_url);
    }
  }, [getAvatarImagesQuery?.data, currentProfilePic]);

  const updateProfilePicMutation = useMutation({
    mutationKey: ["updateProfilePic"],
    mutationFn: () => updateProfilePic(profilePic ?? ""),
    onSuccess: () => {
      closeSheet();
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
    },
    onError: (error) => {
      closeSheet();
      console.log(error.message);

      toast.show("Something went wrong", {
        type: "warning",
      });
    },
  });
  // console.log("currentProfilePic", currentProfilePic);

  return (
    <View style={styles.container}>
      {/* <ThemedText
        style={{
          fontSize: getFontSize(18),
          fontFamily: "PoppinsSemiBold",
          textAlign: "center",
        }}
      >
        Avatars
      </ThemedText> */}
      <View style={{ alignItems: "center" }}>
        <AvatarImage
          imageType="View"
          imageUri={profilePic}
          isSubscribed={isSubscribed}
        />
      </View>
      <FlatList
        // horizontal
        numColumns={4}
        data={getAvatarImagesQuery?.data}
        keyExtractor={(_, index) => index.toString() + "AvatarImages"}
        // ItemSeparatorComponent={() => (
        //   <View style={{ width: horizontalScale(10) }} />
        // )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{
          gap: horizontalScale(10),
        }}
        renderItem={({ item }) => {
          // console.log(item?.avatar_url === profilePic);

          return (
            <TouchableOpacity onPress={() => setProfilePic(item?.avatar_url)}>
              <AvatarImage
                isSubscribed={item?.is_subscribed_only}
                imageType="Option"
                imageUri={item?.avatar_url}
                selected={
                  decodeURIComponent(item?.avatar_url) ===
                  decodeURIComponent(profilePic ?? "") // this compare by removing spaces from the url
                }
              />
            </TouchableOpacity>
          );
        }}
      />
      <AlertButton
        secondBtnLoading={updateProfilePicMutation.isPending}
        firstBtnLabel="Cancel"
        secondBtnLabel="Save"
        firstBtnAction={closeSheet}
        secondBtnAction={() => updateProfilePicMutation.mutateAsync()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(30),
    justifyContent: "space-between",
    flex: 1,
  },
});

export default AvatarSection;
