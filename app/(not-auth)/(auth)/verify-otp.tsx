import React, { useEffect, useRef, useState } from "react";
import { View, Alert, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/SupaLegend";
import { ThemedText } from "@/components/ui/theme-text";
import { GradientButton } from "@/components/ui/gradient-button";
import { horizontalScale, verticalScale } from "@/metric";
import Container from "@/components/ui/container";
import BackButton from "@/components/ui/back-button";
import { globalStyles } from "./weclome-screen";
import { getFontSize } from "@/font";
import { OtpInput, OtpInputRef, OtpInputProps } from "react-native-otp-entry";
import {
  getHash,
  removeListener,
  startOtpListener,
  useOtpVerify,
} from "react-native-otp-verify";
import Animated, {
  LayoutAnimationConfig,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useRoute } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

const VerifyOtp = () => {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const otpRef = useRef<OtpInputRef>(null);
  const route = useRoute();
  const { number } = route?.params;
  const toast = useToast();
  const [enteredWrongNumber, setEnteredWrongNumber] = useState<boolean>(false);

  const { hash, otp, message, timeoutError, stopListener, startListener } =
    useOtpVerify({ numberOfDigits: 6 });

  const keyboard = useAnimatedKeyboard();
  useEffect(() => {
    StatusBar.setHidden(true);
  });

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    height: withTiming(keyboard.height.value, { duration: 300 }),
  }));

  // using methods
  useEffect(() => {
    getHash()
      .then((hash) => {
        // use this hash in the message.
      })
      .catch(console.log);

    startOtpListener((message) => {
      // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
      const match = /(\d{4})/g.exec(message);
      const otp = match ? match[1] : "";
      otpRef.current?.setValue(otp);
      setOtpValue(otp);
    });
    return () => removeListener();
  }, []);

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: number, // Replace with dynamic phone
        token: otpValue,
        type: "sms",
      });

      if (error) throw error;

      // Alert.alert("Success", "Phone number verified successfully!");
      toast.show("Phone number verified successfully!", {
        type: "success",
      });

      router.push("/home"); // Navigate to home screen after success
    } catch (err) {
      // Alert.alert("Verification Failed");
      toast.show("Verification Failed", {
        type: "danger",
      });
      setEnteredWrongNumber(true);
    }
  }

  return (
    <Container style={{ paddingHorizontal: horizontalScale(16) }}>
      <View>
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
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          theme={{
            pinCodeTextStyle: {
              color: "white",
              fontSize: getFontSize(16),
              borderColor: enteredWrongNumber ? "white" : "red",
            },
          }}
          onTextChange={(text) => setOtpValue(text)}
        />
      </View>
      <View style={globalStyles.footer}>
        <GradientButton onPress={handleVerifyOtp} title="VERIFY" />
      </View>

      {/* Smooth Keyboard Adjustment */}
      <LayoutAnimationConfig skipEntering>
        <Animated.View style={animatedKeyboardStyle} />
      </LayoutAnimationConfig>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(209, 209, 209, 1)",
    marginBottom: verticalScale(20),
  },
  otpInput: {
    width: "80%",
    height: verticalScale(50),
  },
  otpBox: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 20,
    textAlign: "center",
  },
  otpHighlight: {
    borderColor: "#4CAF50",
  },
});

export default VerifyOtp;
