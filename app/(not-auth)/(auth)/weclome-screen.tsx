import BackButton from "@/components/ui/back-button";
import Container from "@/components/ui/container";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Logo from "@/assets/svg/logo.svg";
import { getFontSize } from "@/font";
import { GradientButton } from "@/components/ui/gradient-button";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";
import SampleIcon from "@/assets/svg/sample-icon.svg";
import GoogleIcon from "@/assets/svg/google-icon.svg";
import AppleIcon from "@/assets/svg/apple-icon.svg";
import GoogleButton from "@/components/auth/google-button";
import { OutlineButton } from "@/components/ui/outline-button";
import AppleButton from "@/components/auth/apple-button";

const WeclomeScreen = () => {
  return (
    <Container
      style={{
        paddingHorizontal: horizontalScale(16),
        // paddingVertical: verticalScale(10),
      }}
    >
      <View
        style={[
          globalStyles.header,
          {
            marginLeft: horizontalScale(8),
            marginTop: verticalScale(8),
          },
        ]}
      >
        <BackButton />
      </View>
      <View style={[globalStyles.heroSection, { alignItems: "center" }]}>
        <Logo width={horizontalScale(180)} height={verticalScale(180)} />
        <ThemedText
          style={{
            fontSize: getFontSize(28),
            fontFamily: "PoppinsBold",
            marginTop: verticalScale(21),
          }}
        >
          Welcome!
        </ThemedText>
        <ThemedText
          style={{
            width: "100%",
            textAlign: "center",
            // marginBottom: verticalScale(20),
            // marginBottom: verticalScale(24),
          }}
        >
          Let’s Get You Started Toward Better Habits
        </ThemedText>

        <GradientButton
          onPress={() => router.push("/(not-auth)/(auth)/sign-up")}
          style={{ width: "100%", marginVertical: verticalScale(24) }}
          title="SIGN UP"
        />
        <OutlineButton
          type="secondary"
          style={{ width: "100%", marginBottom: verticalScale(20) }}
          title="LOG IN"
          onPress={() => router.push("/(not-auth)/(auth)/sign-in")}
          // disable={true}
        />
        <SampleIcon width={"100%"} />
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
      </View>
      <View
        style={[
          globalStyles.footer,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ThemedText>By continuing, you accept our</ThemedText>
        <ThemedText>
          <ThemedText style={{ color: "#8A2BE2" }}>
            Terms of Service{" "}
          </ThemedText>
          and{" "}
          <ThemedText style={{ color: "#8A2BE2" }}>Privacy Policy</ThemedText>.
        </ThemedText>
      </View>
    </Container>
  );
};

export const globalStyles = StyleSheet.create({
  header: {
    flex: 0.5,
    // backgroundColor: "red",
  },
  heroSection: {
    flex: 6,

    // backgroundColor: "green",
  },
  footer: {
    flex: 1,

    // backgroundColor: "yellow",
  },
});

export default WeclomeScreen;
