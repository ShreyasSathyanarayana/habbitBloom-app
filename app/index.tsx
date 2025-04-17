import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { horizontalScale, verticalScale } from "@/metric";
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/assets/svg/habbitbloom.svg";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useRouter } from "expo-router";

interface FormProps extends FieldValues {
  phoneNumber: string;
}

export default function Index() {
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 5,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View entering={ZoomIn.springify().damping(40).stiffness(200)}>
        <Logo width={horizontalScale(350)} />
        <ActivityIndicator size={"large"} animating={true} color={"white"} />
      </Animated.View>
    </SafeAreaView>
  );
}
