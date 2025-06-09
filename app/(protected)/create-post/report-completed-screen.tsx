import Container from "@/components/ui/container";
import React from "react";
import { StyleSheet, View } from "react-native";
import ReportSuccessIcon from "@/assets/svg/report-success-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { GradientButton } from "@/components/ui/gradient-button";
import { router } from "expo-router";

const _successIcon = horizontalScale(120);

const ReportCompletedScreen = () => {
  return (
    <Container style={{ paddingHorizontal: horizontalScale(16) }}>
      <View style={styles.heroSection}>
        <ReportSuccessIcon width={_successIcon} height={_successIcon} />
        <ThemedText style={styles.title}>Thanks for letting us know</ThemedText>
        <ThemedText style={styles.subTitle}>
          We’ll review the post and take appropriate action
        </ThemedText>
      </View>
      <GradientButton
        title="Done"
        onPress={() => {
          router.back();
        }}
        style={{
          marginBottom: verticalScale(24),
        }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: getFontSize(24),
    fontFamily: "PoppinsSemiBold",
    marginTop: verticalScale(24),
    marginBottom: verticalScale(16),
    textAlign: "center",
  },
  subTitle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
});

export default ReportCompletedScreen;
