import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarImage from "./avatar-image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvatarImages, updateProfilePic } from "@/api/api";
import { FlatList, SheetManager } from "react-native-actions-sheet";
import AlertButton from "@/action-sheets/alert-button";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";
import { getUserRole, isUserSubscribed } from "@/utils/persist-storage";
import ModalContainer from "@/components/ui/modal-container";
import SheetHeader from "@/action-sheets/sheet-header";

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
  const [isSubscribedModalOpen, setIsSubscribedModalOpen] = useState(false);
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
  const closeModal = () => {
    setIsSubscribedModalOpen(false);
  };
  const openModal = () => {
    setIsSubscribedModalOpen(true);
  };

  const onChangeProfilePic = (imageSubscribed: boolean, imageUri: string) => {
    if (!imageSubscribed) {
      // if the image is not subscribed no need to check
      setProfilePic(imageUri);
    } else if (isSubscribed && imageSubscribed) {
      // if the image is subscribed and use is also subscribed then update the profile pic
      setProfilePic(imageUri);
    } else {
      // user how are not subscribed then show modal
      openModal();
    }
  };

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
            <TouchableOpacity
              onPress={() => {
                // setProfilePic(item?.avatar_url);
                onChangeProfilePic(item?.is_subscribed_only, item?.avatar_url);
              }}
            >
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
      <Modal
        visible={isSubscribedModalOpen}
        style={styles.modalStyle}
        onRequestClose={closeModal}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            paddingHorizontal: horizontalScale(16),
          }}
        >
          <ModalContainer>
            <SheetHeader title="Premium Avatar" onClose={closeModal} />
            <ThemedText style={{ fontSize: getFontSize(14) }}>
              Unlock with a subscription to access this avatar and more.
            </ThemedText>
            <AlertButton
              firstBtnLabel="Cancel"
              firstBtnAction={closeModal}
              secondBtnLabel="View Plans"
              secondBtnAction={() => {
                closeModal();
                router.push("/(protected)/subscription");
              }}
              style={{ paddingBottom: 0 }}
            />
          </ModalContainer>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(30),
    justifyContent: "space-between",
    flex: 1,
  },
  modalStyle: {
    flex: 1,
    // justifyContent: "center",
    padding: horizontalScale(16),
    // alignItems: "center",
  },
});

export default AvatarSection;
