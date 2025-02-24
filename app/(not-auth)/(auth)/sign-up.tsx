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
import { supabase } from "@/utils/SupaLegend";
import { useToast } from "react-native-toast-notifications";
import Label from "@/components/ui/Label";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import { phoneInputStyles } from "./verify-number";

const SignUp = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const password = watch("password"); // Watch the password field
  const toast = useToast();

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const checkExistingUser = async (email: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .or(`email.eq.${email}`);
    console.log(data, error);

    if (data?.length) {
      toast.show("User Already Exist", {
        type: "danger",
      });
      return true;
    }
    return false;
  };

  const onSubmit = async (formData: any) => {
    try {
      console.log("Form Data:", formData);
      console.log("Button is clicked");

      if (!selectedCountry?.callingCode) {
        toast.show("Invalid country selection.", { type: "danger" });
        return;
      }

      // ✅ Format Phone Number
      const phoneNumber =
        `${selectedCountry.callingCode}${formData.phoneNumber}`.replace(
          /\s+/g,
          ""
        ); // Remove spaces

      // ✅ Validate Phone Number
      if (
        !isValidPhoneNumber(formData.phoneNumber, selectedCountry as ICountry)
      ) {
        toast.show("Enter a valid phone number.", { type: "danger" });
        return;
      }

      // ✅ Check if user already exists before signing up
      const userExists = await checkExistingUser(formData.email);
      if (userExists) return;

      // ✅ Sign Up the User
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: formData?.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

      if (signUpError) {
        console.error("SignUp Error:", signUpError);
        toast.show(signUpError.message, { type: "danger" });
        return;
      }

      // ✅ Ensure user ID is available before inserting into "profiles"
      if (!signUpData.user?.id) {
        toast.show("User ID not found after sign-up.", { type: "danger" });
        return;
      }

      // ✅ Insert user data into 'profiles' table
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: signUpData.user.id, // Store the auth UID
          full_name: formData.fullName,
          mobile: phoneNumber, // Use formatted phone number
          email: formData.email,
        },
      ]);

      if (insertError) {
        console.error("Insert Error:", insertError);
        toast.show("Failed to save user profile.", { type: "danger" });
        return;
      }

      // ✅ Navigate to Sign-in Page
      router.push("/(not-auth)/(auth)/sign-in");
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      toast.show(error.message || "Something went wrong.", { type: "danger" });
    }
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
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: "Phone number is required",
                  validate: (value) =>
                    (selectedCountry &&
                      isValidPhoneNumber(value, selectedCountry)) ||
                    "Invalid phone number",
                }}
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => (
                  <Label
                    label="Phone Number"
                    helperText={errors.phoneNumber?.message}
                    error={!!errors.phoneNumber}
                  >
                    <PhoneInput
                      defaultValue="+91"
                      value={value}
                      allowFontScaling={false}
                      theme="dark"
                      popularCountries={["IN"]}
                      modalStyles={{
                        modal: {
                          backgroundColor: "black",
                          borderTopWidth: 1,
                          borderColor: "rgba(91, 91, 99, 0.6)",
                        },
                        countryButton: {
                          backgroundColor: "rgba(31, 34, 42, 1)",
                          borderColor: "rgba(60, 60, 67, 0.6)",
                          height: verticalScale(56),
                        },
                        searchInput: {
                          backgroundColor: "rgba(31, 34, 42, 1)",
                          borderColor: "rgba(31, 34, 42, 1)",
                          fontSize: getFontSize(16),
                          height: verticalScale(56),
                        },
                      }}
                      phoneInputStyles={{ 
                        container: phoneInputStyles.inputContainer,
                        flagContainer: phoneInputStyles.flagContainer,
                        input: phoneInputStyles.inputText,
                        callingCode: phoneInputStyles.callingCode,
                      }}
                      
                      onChangePhoneNumber={onChange}
                      selectedCountry={selectedCountry}
                      onChangeSelectedCountry={handleSelectedCountry}
                      placeholder="Phone Number"
                    />
                  </Label>
                )}
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

export default SignUp;
