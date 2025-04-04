import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import TextField from "@/components/ui/TextField";
import { ThemedText } from "@/components/ui/theme-text";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import UserNameIcon from "@/assets/svg/name-icon.svg";
import DescriptionIcon from "@/assets/svg/description-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import AlertButton from "./alert-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfileInfo } from "@/api/api";
const closeSheet = () => {
  // Close the action sheet
  SheetManager.hide("update-profile-info");
};

const UpdateProfileInfoSheet = (props: SheetProps<"update-profile-info">) => {
  const payload = props.payload;
  const queryClient = useQueryClient();
  const { control, setValue, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      userName: "",
      profileBio: "",
    },
  });

  useEffect(() => {
    if (payload?.full_name) {
      setValue("userName", payload?.full_name);
    }
    if (payload?.profile_bio) {
      setValue("profileBio", payload?.profile_bio);
    }
  }, [payload]);

  const resetDefaultValues = () => {
    setValue("userName", payload?.full_name ?? "");
    setValue("profileBio", payload?.profile_bio ?? "");
  };

  const updateProfileInfoMutation = useMutation({
    mutationKey: ["updateProfileInfo"],
    mutationFn: () => {
      return updateUserProfileInfo(
        watch("userName")?.trim(),
        watch("profileBio")?.trim()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      closeSheet();
    },
  });

  return (
    <ActionSheetContainer1 onClose={() => reset()} sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(24) }}>
        <Controller
          control={control}
          rules={{ required: "Enter your full name" }}
          render={({
            field: { onChange, onBlur, value },
            formState: { errors },
          }) => (
            <TextField
              label="Full Name"
              placeholder="Enter Full Name"
              maxLength={25}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              helperText={errors.userName?.message}
              error={!!errors.userName}
              leftIcon={<UserNameIcon width={24} height={24} fill="white" />}
            />
          )}
          name="userName"
        />
        <Controller
          control={control}
          rules={{
            // required: "Habit Name is required",
            validate: (val) =>
              val?.length < 100 || "can contain only 200 character",
          }}
          render={({
            field: { onChange, onBlur, value },
            formState: { errors },
          }) => (
            <TextField
              // key={"habitName"}
              label="Description (Optional)"
              placeholder="Description here"
              numberOfLines={5}
              textarea={true}
              maxLength={100}
              multiline
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              leftIcon={
                <DescriptionIcon
                  width={horizontalScale(24)}
                  height={horizontalScale(24)}
                />
              }
              helperText={errors.profileBio?.message}
              error={!!errors.profileBio}
            />
          )}
          name="profileBio"
        />
        <AlertButton
          firstBtnLabel={"Reset"}
          secondBtnLabel={"Save"}
          secondBtnLoading={updateProfileInfoMutation.isPending}
          firstBtnAction={() => {
            resetDefaultValues();
          }}
          secondBtnAction={handleSubmit((data) =>
            updateProfileInfoMutation.mutateAsync()
          )}
        />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default UpdateProfileInfoSheet;
