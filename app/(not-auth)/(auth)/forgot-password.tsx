import { globalStyles } from "@/app/(not-auth)/(auth)/weclome-screen";
import BackButton from "@/components/ui/back-button";
import Container from "@/components/ui/container";
import TextField from "@/components/ui/TextField";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import EmailIcon from "@/assets/svg/email-icon.svg";
import FullNameIcon from "@/assets/svg/name-icon.svg";
import PasswordIcon from "@/assets/svg/password-icon.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "@/components/ui/gradient-button";
import { router } from "expo-router";
import SampleIcon from "@/assets/svg/sample-icon.svg";
import PasswordShowIcon from "@/assets/svg/password-show.svg";
import PasswordHideIcon from "@/assets/svg/password-hide.svg";
import { supabase } from "@/utils/SupaLegend";
import { useToast } from "react-native-toast-notifications";
import GoogleButton from "@/components/auth/google-button";
import AppleButton from "@/components/auth/apple-button";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/auth-api";

const ForgotPassword = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  // console.log(control._fields);
  const toast = useToast();
  const password = watch("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const mutation = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: (pass: string) => {
      return updatePassword(pass);
    },
    onSuccess: () => {
      toast.show("Password Updated Succesfully!", {
        type: "success",
      });
      router.back();
    },
    onError: (error) => {
      toast.show(error.message, {
        type: "danger",
      });
    },
  });
  const onSubmit = async (data: any) => {
    mutation.mutateAsync(data?.password);
    // const { error } = await supabase.auth.updateUser({ password: password });
    // console.log(error);

    // if (error) {
    //   toast.show("Something went Wrong!", {
    //     type: "danger",
    //   });
    // } else {
    //   toast.show("Password Updated Succesfully!", {
    //     type: "success",
    //   });
    //   router.back();
    // }

    // toast.show("Login Succesful", {
    //   type: "success",
    // });
    // Alert.alert("Login Succesful");
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <KeyboardAwareScrollView
          bottomOffset={50} // Adjust this if needed
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
        >
          {/* Back Button */}
          <View>
            <BackButton />
          </View>

          {/* Header */}
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.title}>Set a New Password</ThemedText>
            <ThemedText style={styles.subtitle}>
              Create a strong password to keep your account secure.
            </ThemedText>

            {/* Input Fields */}
            <View
              style={{
                flexGrow: 1,
                justifyContent: "space-between",
                // backgroundColor: "red",
              }}
            >
              <View style={styles.form}>
                {/* Password */}
                <Controller
                  control={control}
                  rules={{
                    required: "Enter your password",
                    validate: (val) =>
                      val?.length > 8 ||
                      "Password should contain atleast 8 Character",
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
                        leftIcon={
                          <PasswordIcon width={24} height={24} fill="white" />
                        }
                        rightIcon={
                          <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <PasswordHideIcon />
                            ) : (
                              <PasswordShowIcon />
                            )}
                          </TouchableOpacity>
                        }
                      />
                    );
                  }}
                  name="password"
                />
                <Controller
                  control={control}
                  rules={{
                    required: "Enter your password",
                    validate: (val) =>
                      val == password || "Passwords do not match",
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
              </View>

              <GradientButton
                onPress={handleSubmit(onSubmit)}
                title="LOG IN"
                style={{ marginVertical: verticalScale(32) }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* Keyboard Toolbar (Must be outside the scroll view) */}
      </SafeAreaView>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: "black",
    paddingHorizontal: horizontalScale(16),
    // justifyContent: "space-between",
  },
  title: {
    fontSize: getFontSize(24),
    fontFamily: "Poppins_600SemiBold",
  },
  subtitle: {
    color: "rgba(209, 209, 209, 1)",
    marginBottom: verticalScale(20),
  },
  form: {
    gap: verticalScale(16),
  },
});

export default ForgotPassword;
