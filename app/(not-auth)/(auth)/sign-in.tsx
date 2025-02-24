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
import GoogleIcon from "@/assets/svg/google-icon.svg";
import AppleIcon from "@/assets/svg/apple-icon.svg";
import PasswordShowIcon from "@/assets/svg/password-show.svg";
import PasswordHideIcon from "@/assets/svg/password-hide.svg";
import { supabase } from "@/utils/SupaLegend";
import { useToast } from "react-native-toast-notifications";
import GoogleButton from "@/components/auth/google-button";
import AppleButton from "@/components/auth/apple-button";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/auth-api";

const SignIn = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const mutation = useMutation({
    mutationKey: ["signIn"],
    mutationFn: (data: any) => {
      return signIn(data.email, data.password);
    },
    onError: (error: any) => {
      toast.show(error.message, {
        type: error.type,
      });
    },
    onSuccess: () => {
      toast.show("Login Succesful", {
        type: "success",
      });
    },
  });
  const toast = useToast();
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const onSubmit = async (data: any) => {
    mutation.mutateAsync(data);
    // const { data: signInData, error } = await supabase.auth.signInWithPassword({
    //   email: data.email,
    //   password: data.password,
    // });
    // if (error) {
    //   // Alert.alert('Something went wrong')
    //   toast.show(error.message, {
    //     type: "danger",
    //   });

    //   return;
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
          <View>
            <ThemedText style={styles.title}>Welcome Back!</ThemedText>
            <ThemedText style={styles.subtitle}>
              Log in to continue your journey.
            </ThemedText>

            {/* Input Fields */}
            <View style={styles.form}>
              {/* Email */}
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({
                  field: { onChange, onBlur, value },
                  formState: { errors, touchedFields },
                }) => {
                  return (
                    <TextField
                      label="Email"
                      placeholder="Enter Email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      helperText={errors.email?.message}
                      error={!!errors.email}
                      leftIcon={
                        <EmailIcon width={24} height={24} fill="white" />
                      }
                    />
                  );
                }}
                name="email"
              />

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
                      label="Password"
                      placeholder="Enter Password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={showConfirmPassword}
                      helperText={errors.password?.message}
                      error={!!errors.password}
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
                name="password"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: verticalScale(24),
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push("/(not-auth)/(auth)/forgot-password")
                }
              >
                <ThemedText style={{ color: "rgba(135, 144, 169, 1)" }}>
                  Forgot Your Password?
                </ThemedText>
              </TouchableOpacity>
            </View>
            <GradientButton
              onPress={handleSubmit(onSubmit)}
              title="LOG IN"
              style={{ marginVertical: verticalScale(32) }}
            />
          </View>
          <SampleIcon width={"100%"} height={verticalScale(30)} />
          <View
            style={{
              marginTop: verticalScale(30),
              justifyContent: "center",
              alignItems: "center",
              gap: horizontalScale(25),
              flexDirection: "row",
            }}
          >
            {/* <TouchableOpacity>
              <GoogleIcon
                width={horizontalScale(36)}
                height={verticalScale(36)}
              />
            </TouchableOpacity> */}
            <GoogleButton />
            <AppleButton />
          </View>
          {/* <View
            style={{
              alignItems: "center",
              position: "absolute",
              bottom: verticalScale(34),
              left: horizontalScale(90),
            }}
          >
            <ThemedText>
              New here?{" "}
              <ThemedText
                onPress={() => {
                  router.replace("/(not-auth)/(auth)/weclome-screen");
                  router.push("/(not-auth)/(auth)/sign-up");
                }}
                style={{
                  color: "rgba(138, 43, 226, 1)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Sign Up now
              </ThemedText>
            </ThemedText>
          </View> */}
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
  },
  title: {
    fontSize: getFontSize(24),
    fontFamily: "PoppinsSemiBold",
  },
  subtitle: {
    color: "rgba(209, 209, 209, 1)",
    marginBottom: verticalScale(20),
  },
  form: {
    gap: verticalScale(16),
  },
});

export default SignIn;
