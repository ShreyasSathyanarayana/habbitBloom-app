import React, { useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AppleIcon from "@/assets/svg/apple-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { useToast } from "react-native-toast-notifications";

const AppleButton = () => {
  //   const configGoogleSignIn = () => {
  //     GoogleSignin.configure({
  //       webClientId:
  //         "163765196168-5o87bk1dt4vrkjf88e87kfujlv9g14qh.apps.googleusercontent.com",
  //     });
  //   };
  //   useEffect(() => {
  //     configGoogleSignIn(); // will execute everytime the component mounts
  //   }, []);
  const toast = useToast();

  const signIn = async () => {
    console.log("button is clicked");

    try {
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
      console.log(JSON.stringify(res, null, 2));
      toast.show("Login Successful!", {
        type: "success",
      });
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.error("User Sign In is required");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error("Google Play Services are needed");
          break;
      }
      console.log("Error", error.code);
    }
  };
  return (
    <TouchableOpacity style={Platform.OS !== "ios" && { display: "none" }}>
      <AppleIcon
        // onPress={signIn}
        width={horizontalScale(36)}
        height={verticalScale(36)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default AppleButton;
