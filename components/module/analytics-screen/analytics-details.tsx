import LinerGradientContainer from "@/components/ui/liner-gradient-container";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import AnalyticsIcon from "@/assets/svg/analytics-icon.svg";
type Props = {
  selectedOption: string;
} & ViewProps;

const AnalyticsDetails = ({ selectedOption, style, ...rest }: Props) => {
  return (
    <View {...rest} style={[styles.container, style]}>
      <ThemedText
        style={{ fontSize: getFontSize(14), fontFamily: "PoppinsMedium" }}
      >
        This{" "}
        {selectedOption == "Weekly"
          ? "Week"
          : selectedOption == "Monthly"
          ? "Month"
          : "Year"}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: getFontSize(12),
          color: "rgba(196, 196, 196, 1)",
          marginTop: verticalScale(2),
        }}
      >
        Mar 10 - Mar 16
      </ThemedText>
      <LinerGradientContainer style={{ marginTop: verticalScale(12) }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(12),
          }}
        >
          <AnalyticsIcon
            width={horizontalScale(36)}
            height={horizontalScale(36)}
          />
          <View>
            <ThemedText
              style={{
                fontSize: getFontSize(14),
                fontFamily: "PoppinsSemiBold",
              }}
            >
              All Habits
            </ThemedText>
            <ThemedText style={styles.subTitle}>Summary</ThemedText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: verticalScale(12),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.column}>
            <ThemedText style={styles.subTitle}>COMPLETED</ThemedText>
            <ThemedText style={styles.subValue}>5</ThemedText>
          </View>
          <View style={styles.column}>
            <ThemedText style={styles.subTitle}>FAILED</ThemedText>
            <ThemedText
              style={[styles.subValue, { color: "rgba(227, 82, 79, 1)" }]}
            >
              0
            </ThemedText>
          </View>
        </View>
      </LinerGradientContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(24),
  },
  subTitle: {
    fontSize: getFontSize(12),
    fontFamily: "PoppinsMedium",
  },
  column: {
    flex: 1,
  },
  subValue: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsSemiBold",
  },
});

export default AnalyticsDetails;
