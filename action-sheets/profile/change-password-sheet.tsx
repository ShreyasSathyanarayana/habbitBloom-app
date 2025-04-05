import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { verticalScale } from "@/metric";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import PasswordShowIcon from "@/assets/svg/password-show.svg";
import PasswordHideIcon from "@/assets/svg/password-hide.svg";
import PasswordIcon from "@/assets/svg/password-icon.svg";
import TextField from "@/components/ui/TextField";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import AlertButton from "../alert-button";
import {
  getLoginMode,
  getPassword,
  setPassword,
} from "@/utils/persist-storage";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/auth-api";
import { useToast } from "react-native-toast-notifications";
const closeSheet = () => {
  SheetManager.hide("change-password");
};

const ChangePasswordSheet = (props: SheetProps<"change-password">) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const toast = useToast();
  const loginMode = getLoginMode();
  const localPassword = getPassword();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
    mode: "onSubmit",
  });
  const mutation = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: (pass: string) => {
      return updatePassword(pass);
    },
    onSuccess: () => {
      setPassword(watch("password"));
      closeSheet();
      toast.show("Password Updated!", {
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.show(error.message, {
        type: error.type,
      });
    },
  });
  const onSubmit = async (data: any) => {
    mutation.mutateAsync(data?.password);
    // console.log("data", data);
  };
  console.log("logiMode", loginMode);
  console.log("localPassword", localPassword);

  return (
    <ActionSheetContainer1 onClose={() => reset()} sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(16) }}>
        <Controller
          control={control}
          rules={{
            required: "Enter your Current Password",
            validate: (val) =>
              val === localPassword || "Current Password is Incorrect",
          }}
          render={({
            field: { onChange, onBlur, value },
            formState: { errors, touchedFields },
          }) => {
            return (
              <TextField
                label="Current Password"
                placeholder="Enter Current Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={showCurrentPassword}
                helperText={errors.currentPassword?.message}
                error={!!errors.currentPassword}
                // success={success}
                leftIcon={<PasswordIcon width={24} height={24} fill="white" />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <PasswordHideIcon />
                    ) : (
                      <PasswordShowIcon />
                    )}
                  </TouchableOpacity>
                }
              />
            );
          }}
          name="currentPassword"
        />
        <Controller
          control={control}
          rules={{
            validate: {
              required: (val) => val?.length > 0 || "Enter your password",
              minLength: (val) =>
                val?.length >= 8 ||
                "Password should contain at least 8 characters",
              notSame: (val) =>
                val !== localPassword ||
                "Password should not be the same as the old one",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            formState: { errors, touchedFields },
          }) => {
            return (
              <TextField
                label="New Password"
                placeholder="Enter New Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={showPassword}
                helperText={errors.password?.message}
                error={!!errors.password}
                // success={success}
                leftIcon={<PasswordIcon width={24} height={24} fill="white" />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <PasswordHideIcon /> : <PasswordShowIcon />}
                  </TouchableOpacity>
                }
              />
            );
          }}
          name="password"
        />
        <View style={{ gap: verticalScale(12) }}>
          <Controller
            control={control}
            rules={{
              required: "Enter your password",
              validate: (val) =>
                val == watch("password") || "Passwords do not match",
            }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors, touchedFields },
            }) => {
              return (
                <TextField
                  label="Confirm Password"
                  placeholder="Enter Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={showConfirmPassword}
                  helperText={errors.confirmPassword?.message}
                  error={!!errors.confirmPassword}
                  // success={success}
                  leftIcon={
                    <PasswordIcon width={24} height={24} fill="white" />
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <PasswordHideIcon />
                      ) : (
                        <PasswordShowIcon />
                      )}
                    </TouchableOpacity>
                  }
                />
              );
            }}
            name="confirmPassword"
          />

          <TouchableOpacity>
            <ThemedText
              style={{
                fontSize: getFontSize(14),
                color: "rgba(135, 144, 169, 1)",
              }}
            >
              Forgot Your Password?
            </ThemedText>
          </TouchableOpacity>
        </View>
        <AlertButton
          firstBtnLabel="Reset"
          secondBtnLabel="Save"
          firstBtnAction={() => reset()}
          secondBtnLoading={mutation.isPending}
          secondBtnAction={handleSubmit(onSubmit)}
        />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default ChangePasswordSheet;
