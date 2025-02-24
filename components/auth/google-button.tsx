import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import GoogleIcon from "@/assets/svg/google-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { useToast } from "react-native-toast-notifications";
import { supabase } from "@/utils/SupaLegend";
import { OutlineButton } from "../ui/outline-button";
import { ThemedText } from "../ui/theme-text";

const GoogleButton = () => {
  const [loading, setLoading] = useState(false); // Loader state
  const toast = useToast();

  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "163765196168-c71u1cpgmp30dmbcq0mek6qklgfukoo4.apps.googleusercontent.com",
      iosClientId:
        "163765196168-9vfrq9gnenovtfnkf6p2aeuo39kmdc5u.apps.googleusercontent.com",
      forceCodeForRefreshToken: false,
    });
  };

  useEffect(() => {
    configGoogleSignIn();
  }, []);

  const signIn = async () => {
    console.log("Google Sign-In button clicked");
    setLoading(true); // Start loader

    try {
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
      const nonce = Math.random().toString(36).substring(2);

      if (res.data?.idToken) {
        // Sign in with Supabase using the Google ID token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: res.data?.idToken,
        });

        if (error) {
          console.error("Supabase Auth Error:", error.message);
          toast.show(error.message, { type: "danger" });
          return;
        }

        // Get user info
        const user = data?.user;
        const userId = user?.id;
        const fullName = res.data?.user.name;
        const email = res.data?.user.email;

        if (userId) {
          // Check if user exists in profiles
          const { data: existingUser, error: fetchError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", userId)
            .single();

          if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Error checking profile:", fetchError.message);
            return;
          }

          // Insert only if the user does not exist
          if (!existingUser) {
            const { error: profileError } = await supabase
              .from("profiles")
              .insert({
                id: userId,
                full_name: fullName,
                email: email,
              });

            if (profileError) {
              console.error("Error inserting profile:", profileError.message);
            } else {
              toast.show("Login Successful!", { type: "success" });
            }
          }
        }

        console.log("Google Sign-In Success:", JSON.stringify(res, null, 2));
        toast.show("Login Successful!", { type: "success" });
      }
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.error("User Sign-In was cancelled");
          toast.show("Sign in not completed", { type: "warning" });
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error("Google Play Services are required");
          break;
        default:
          console.error("Sign-In Error:", error.message);
      }
      toast.show("Google Sign-In Failed!", { type: "danger" });
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <>
      {Platform.OS !== "ios" ? (
        <OutlineButton
          onPress={signIn}
          style={{ width: "100%" }}
          disabled={loading}
        >
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="rgba(138, 43, 226, 1)" />
            ) : (
              <>
                <GoogleIcon
                  width={horizontalScale(24)}
                  height={verticalScale(24)}
                />
                <ThemedText style={{ fontFamily: "PoppinsBold" }}>
                  CONTINUE WITH GOOGLE
                </ThemedText>
              </>
            )}
          </View>
        </OutlineButton>
      ) : (
        <TouchableOpacity onPress={signIn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <GoogleIcon
              width={horizontalScale(36)}
              height={verticalScale(36)}
            />
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: verticalScale(12),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: horizontalScale(10),
  },
});

export default GoogleButton;
