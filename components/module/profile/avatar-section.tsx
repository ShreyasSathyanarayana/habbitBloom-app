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

type Props = {
  currentProfilePic: string | null;
};
const closeSheet = () => {
  SheetManager.hide("profile-pic");
};

const AvatarSection = ({ currentProfilePic }: Props) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const getAvatarImagesQuery = useQuery({
    queryKey: ["getAvatarImages"],
    queryFn: () => getAvatarImages(),
  });
  //   console.log(
  //     "getAvatarImagesQuery",
  //     JSON.stringify(getAvatarImagesQuery.data, null, 2)
  //   );
  const [profilePic, setProfilePic] = React.useState<string | null>(
    currentProfilePic
  );
  useEffect(() => {
    if (getAvatarImagesQuery?.data && !currentProfilePic) {
      setProfilePic(getAvatarImagesQuery?.data[0]?.avatar_url);
    } else if (currentProfilePic) {
      setProfilePic(currentProfilePic);
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

  return (
    <View style={styles.container}>
      <ThemedText
        style={{
          fontSize: getFontSize(18),
          fontFamily: "PoppinsSemiBold",
          textAlign: "center",
        }}
      >
        Avatars
      </ThemedText>
      <View style={{ alignItems: "center" }}>
        <AvatarImage imageType="View" imageUri={profilePic} />
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
          return (
            <TouchableOpacity onPress={() => setProfilePic(item?.avatar_url)}>
              <AvatarImage
                imageType="Option"
                imageUri={item?.avatar_url}
                selected={item?.avatar_url === profilePic}
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
  },
});

export default AvatarSection;
