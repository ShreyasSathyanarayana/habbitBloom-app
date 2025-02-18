import { globalStyles } from "@/app/(not-auth)/(auth)/weclome-screen";
import BackButton from "@/components/ui/back-button";
import Container from "@/components/ui/container";
import TextField from "@/components/ui/TextField";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
import PasswordShowIcon from "@/assets/svg/password-show.svg";
import PasswordHideIcon from "@/assets/svg/password-hide.svg";

const SignUp = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const password = watch("password"); // Watch the password field

  const onSubmit = (data: any) => {
    console.log(data);
    router.push('/(not-auth)/(auth)/verify-number')
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
            <ThemedText style={styles.title}>Create Your Account</ThemedText>
            <ThemedText style={styles.subtitle}>
              Fill in your details to get started!
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
                  formState: { errors },
                }) => (
                  <TextField
                    label="Email"
                    placeholder="Enter Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    helperText={errors.email?.message}
                    error={!!errors.email}
                    leftIcon={<EmailIcon width={24} height={24} fill="white" />}
                  />
                )}
                name="email"
              />

              {/* Full Name */}
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
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    helperText={errors.fullName?.message}
                    error={!!errors.fullName}
                    leftIcon={
                      <FullNameIcon width={24} height={24} fill="white" />
                    }
                  />
                )}
                name="fullName"
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
                  formState: { errors },
                }) => (
                  <TextField
                    label="Password"
                    placeholder="Enter Password"
                    onBlur={onBlur}
                    secureTextEntry={showPassword}
                    onChangeText={onChange}
                    value={value}
                    helperText={errors.password?.message}
                    error={!!errors.password}
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
                )}
                name="password"
              />

              {/* Confirm Password */}
              <Controller
                control={control}
                rules={{
                  required: "Confirm your password",
                  validate: (val) =>
                    val === password || "Passwords do not match",
                }}
                render={({
                  field: { onChange, onBlur, value },
                  formState: { errors },
                }) => (
                  <TextField
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    secureTextEntry={showConfirmPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    helperText={errors.confirmPassword?.message}
                    error={!!errors.confirmPassword}
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
                )}
                name="confirmPassword"
              />
            </View>
            <GradientButton
              onPress={handleSubmit(onSubmit)}
              title="PROCEED"
              style={{ marginVertical: verticalScale(32) }}
            />
          </View>
          {/* <View style={{ alignItems: "center" }}>
            <ThemedText>
              Already have an account?{" "}
              <ThemedText
                onPress={() => {
                  console.log(router);
                  
                  router.replace("/(not-auth)/(auth)/sign-in");
                  // router.push("/(not-auth)/(auth)/sign-in");
                }}
                style={{ color: "rgba(138, 43, 226, 1)" }}
              >
                Log In
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

export default SignUp;
