import React, { useState } from "react";
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

interface FormProps {
  phoneNumber: string;
}

const VerifyNumber = () => {
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const { control, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Use Animated Keyboard Hook for Smooth Transition
  const keyboard = useAnimatedKeyboard();

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    height: withTiming(keyboard.height.value, { duration: 300 }),
  }));

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  function onSubmit(form: FormProps) {
    const phoneNumber = `${selectedCountry?.callingCode} ${form.phoneNumber}`;
    const isValid = isValidPhoneNumber(
      form.phoneNumber,
      selectedCountry as ICountry
    );

    Alert.alert(
      "Verification",
      `Country: ${selectedCountry?.name?.en}\nPhone Number: ${phoneNumber}\nValid: ${isValid}`
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container style={{ paddingHorizontal: horizontalScale(16) }}>
        <StatusBar backgroundColor={"black"} />
        <View style={globalStyles.header}>
          <BackButton />
        </View>

        <View style={globalStyles.heroSection}>
          <ThemedText
            style={{ fontSize: getFontSize(24), fontFamily: "Poppins_700Bold" }}
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
                (selectedCountry &&
                  isValidPhoneNumber(value, selectedCountry)) ||
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
                    container: styles.inputContainer,
                    flagContainer: styles.flagContainer,
                    input: styles.inputText,
                    callingCode: styles.callingCode,
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "rgba(60, 60, 67, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(205, 205, 205, 0.09)",
    height: verticalScale(56),
  },
  flagContainer: {
    backgroundColor: "rgba(60, 60, 67, 0.6)",
  },
  inputText: {
    fontSize: getFontSize(16),
  },
  callingCode: {
    fontSize: getFontSize(16),
  },
});

export default VerifyNumber;
