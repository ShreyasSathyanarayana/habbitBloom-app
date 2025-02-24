import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from "react-native";
import Animated, {
  LayoutAnimationConfig,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";

import { globalStyles } from "@/app/(not-auth)/(auth)/weclome-screen";
import BackButton from "@/components/ui/back-button";
import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import { ThemedText } from "@/components/ui/theme-text";
import Label from "@/components/ui/Label";
import { supabase } from "@/utils/SupaLegend";
import { sendOTP } from "@/api/auth-api";
import { RouteProp, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { Toast, useToast } from "react-native-toast-notifications";

interface FormProps {
  phoneNumber: string;
}

interface RouteParams {
  name: string;
  email: string;
  password: string;
}

const VerifyNumber = () => {
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { name, email, password } = route.params;
  const toast = useToast();

  const { control, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Use Animated Keyboard Hook for Smooth Transition
  const keyboard = useAnimatedKeyboard();
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    height: withTiming(keyboard.height.value, { duration: 300 }),
  }));

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  async function onSubmit(form: FormProps) {
    const phoneNumber = `${selectedCountry?.callingCode}${form.phoneNumber}`;
    const formattedPhone = phoneNumber.replace(/\s+/g, ""); // Remove spaces
    console.log("Button is clicked");

    const isValid = isValidPhoneNumber(
      form.phoneNumber,
      selectedCountry as ICountry
    );

    if (!isValid) {
      // Alert.alert("Error", "Enter a valid phone number.");
      toast.show("Enter a valid phone number.", {
        type: "danger",
      });
      return;
    }

    // ✅ Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        phone: formattedPhone,
        options: {
          data: {
            full_name: name,
            // mobile: formattedPhone,
          },
        },
      }
    );

    if (signUpError) {
      console.log("SignUp Error:", signUpError);
      // Alert.alert("Error", signUpError.message);
      toast.show(signUpError.message, {
        type: "danger",
        // duration: 4000,
      });
      return;
    }

    // // ✅ Insert user data into 'profiles' table
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: signUpData.user?.id, // Store the auth UID
        full_name: name,
        mobile: formattedPhone,
        email,
      },
    ]);

    if (insertError) {
      console.log("Insert Error:", insertError);
      // Alert.alert("Error", "Failed to save user data.");
      toast.show("Failed to save user data.", {
        type: "danger",
      });

      return;
    }

    // ✅ Send OTP for phone verification
    console.log(formattedPhone);

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      console.warn(error);
      // Alert.alert("Error", error.message);
      toast.show(error.message, {
        type: "danger",
      });
    } else {
      router.push({
        pathname: "/(not-auth)/(auth)/verify-otp",
        params: { number: formattedPhone },
      });
    }
  }

  return (
    <Container style={{ paddingHorizontal: horizontalScale(16) }}>
      <View>
        <BackButton />
      </View>

      <View style={globalStyles.heroSection}>
        <ThemedText
          style={{ fontSize: getFontSize(24), fontFamily: "PoppinsBold" }}
        >
          Create an Account
        </ThemedText>
        <ThemedText
          style={{
            color: "rgba(209, 209, 209, 1)",
            marginBottom: verticalScale(24),
          }}
        >
          Enter your mobile number to verify.
        </ThemedText>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (value) =>
              (selectedCountry && isValidPhoneNumber(value, selectedCountry)) ||
              "Invalid phone number",
          }}
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <Label
              label="Phone Number"
              helperText={errors.phoneNumber?.message}
              error={!!errors.phoneNumber}
            >
              <PhoneInput
                defaultValue="+91"
                allowFontScaling={false}
                value={value}
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
                    height: verticalScale(50),
                  },
                  searchInput: {
                    backgroundColor: "rgba(31, 34, 42, 1)",
                    borderColor: "rgba(31, 34, 42, 1)",
                    fontSize: getFontSize(14),
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

      <View style={globalStyles.footer}>
        <GradientButton title="VERIFY" onPress={handleSubmit(onSubmit)} />
      </View>

      {/* Smooth Keyboard Adjustment */}
      <LayoutAnimationConfig skipEntering>
        <Animated.View style={animatedKeyboardStyle} />
      </LayoutAnimationConfig>
    </Container>
  );
};

export const phoneInputStyles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "rgba(60, 60, 67, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(205, 205, 205, 0.09)",
    height: verticalScale(50),
  },
  flagContainer: {
    backgroundColor: "rgba(60, 60, 67, 0.6)",
  },
  inputText: {
    fontSize: getFontSize(15),
    fontFamily: "PoppinsRegular",
    includeFontPadding: false,
  },
  callingCode: {
    fontSize: getFontSize(14),
  },
});

export default VerifyNumber;
