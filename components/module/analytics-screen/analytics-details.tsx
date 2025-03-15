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
      <View
        style={{
          flexDirection: "row",
          marginTop: verticalScale(24),
          alignItems: "center",
          justifyContent: "space-between",
          gap: horizontalScale(17),
        }}
      >
        <View style={styles.streakContainer}>
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            <ThemedText
              style={{
                fontSize: getFontSize(24),
                fontFamily: "PoppinsSemiBold",
              }}
            >
              2{" "}
            </ThemedText>
            days
          </ThemedText>
          <ThemedText
            style={{
              fontFamily: "PoppinsSemiBold",
              marginTop: verticalScale(8),
              fontSize: getFontSize(15),
            }}
          >
            🏆 Completed
          </ThemedText>
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            Week Streak
          </ThemedText>
        </View>
        <View style={styles.streakContainer}>
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            <ThemedText
              style={{
                fontSize: getFontSize(24),
                fontFamily: "PoppinsSemiBold",
              }}
            >
              2{" "}
            </ThemedText>
            days
          </ThemedText>
          <ThemedText
            style={{
              fontFamily: "PoppinsSemiBold",
              marginTop: verticalScale(8),
              fontSize: getFontSize(15),
            }}
          >
            🔥 Streak
          </ThemedText>
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            Highest Streak
          </ThemedText>
        </View>
      </View>
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
  streakContainer: {
    padding: horizontalScale(16),
    backgroundColor: "rgba(30, 30, 30, 1)",
    flex: 1,
    borderRadius: horizontalScale(8),
    gap: verticalScale(4),
  },
});

export default AnalyticsDetails;
