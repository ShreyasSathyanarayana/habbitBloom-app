import PostHeader from "@/components/module/create-or-edit-post/post-header";
import Container from "@/components/ui/container";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BackHandler,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import GalleryIcon from "@/assets/svg/post-gallery.svg";
import CameraIcon from "@/assets/svg/post-camera.svg";
import HashTagIcon from "@/assets/svg/hash-tag.svg";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { pickImage, takePhoto } from "@/camera-function/camera-picker";
import ImageList from "@/components/module/create-or-edit-post/image-list";
import { useToast } from "react-native-toast-notifications";
import { ThemedText } from "@/components/ui/theme-text";
import UserDetail from "@/components/module/create-or-edit-post/user-detail";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostStore } from "@/store/post-store";
import { router, useFocusEffect } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/api";

const { height: windowHeight } = Dimensions.get("window");
const charLimit = 1500;
const _iconSize = horizontalScale(26);

const Index = () => {
  const scrollRef = useRef<ScrollView>(null);
  const { top: paddingTop } = useSafeAreaInsets();
  const toast = useToast();

  const {
    form,
    setDescription,
    addImage,
    removeImage,
    hasUnSavedChanges,
    resetForm,
  } = usePostStore();

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const onBackPress = () => {
    if (hasUnSavedChanges()) {
      SheetManager.show("exit-confirmation");
      return true;
    } else {
      router.back();
    }
  };

  const onGallerySelect = async () => {
    Keyboard.dismiss();
    const image = await pickImage();

    if (image) {
      addImage(image?.uri);
    }
  };

  const onCameraSelect = async () => {
    Keyboard.dismiss();
    const image = await takePhoto();

    if (image) {
      addImage(image?.uri);
    }
  };

  const handleRemoveImage = (index: number) => {
    removeImage(index);
  };

  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationKey: ["createPost"],
    mutationFn: () => createPost(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      resetForm();
      router.back();
    },
    onError: (error) => {
      console.log(error);

      toast.show("Something went wrong", {
        type: "warning",
      });
    },
    // in this case you need to add the post to the cache
  });

  const postButtonEnabled =
    form.description?.length > 0 ||
    form.images?.length > 0 ||
    form.images?.length >= 3;

  return (
    <>
      <View
        style={[
          {
            backgroundColor:
              Platform.OS == "ios" ? "rgba(17, 17, 17, 1)" : "black",
            flex: 1,
          },
          Platform.OS == "android" && { paddingTop },
        ]}
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === "ios" ? "padding" : "translate-with-padding"
          }
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 30} // adjust if needed
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ref={scrollRef}
            contentContainerStyle={[
              styles.container,
              { paddingBottom: verticalScale(100) },
            ]}
          >
            <PostHeader
              title={"Create Post"}
              isLoading={createPostMutation?.isPending}
              disablePostButton={!postButtonEnabled}
              onClickCancel={onBackPress}
              onClickOnPost={() => createPostMutation.mutateAsync()}
            />
            <View
              style={{
                paddingHorizontal: horizontalScale(16),
                paddingTop: verticalScale(10),
              }}
            >
              <UserDetail />

              <TextInput
                returnKeyType="done"
                style={styles.textInput}
                placeholder="What’s up?"
                placeholderTextColor="gray"
                multiline
                autoFocus={true}
                // scrollEnabled

                onChangeText={(t) => {
                  if (t.length <= charLimit) setDescription(t);
                }}
                value={form.description}
                // onContentSizeChange={() => {
                //   scrollRef.current?.scrollToEnd({ animated: true });
                // }}
              />

              <ImageList
                images={form.images ?? []}
                onRemoveImage={handleRemoveImage}
              />
              {form.images?.length >= 4 && (
                <ThemedText
                  style={{
                    color: "red",
                    fontSize: getFontSize(12),
                    marginTop: verticalScale(8),
                  }}
                >
                  You can upload up to 3 images
                </ThemedText>
              )}
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={onGallerySelect}
                  style={styles.btnStyle}
                  hitSlop={10}
                >
                  <GalleryIcon width={_iconSize} height={_iconSize} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onCameraSelect}
                  style={styles.btnStyle}
                  hitSlop={10}
                >
                  <CameraIcon width={_iconSize} height={_iconSize} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <HashTagIcon width={_iconSize} height={_iconSize} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <KeyboardToolbar />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    // flex: 1,
    // height: "100%",
    textAlignVertical: "top",
    color: "white",
    fontSize: getFontSize(15),
    backgroundColor: "transparent",
    maxHeight: windowHeight * 0.3,
    fontFamily: "PoppinsRegular",
    marginTop: verticalScale(10),
  },
  container: {
    flex: 1,
    // paddingHorizontal: horizontalScale(16),
    // paddingVertical: verticalScale(16),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(25),
    marginTop: verticalScale(16),
    // padding: horizontalScale(10),
  },
  btnStyle: {
    // padding: horizontalScale(10),
  },
});

export default Index;
