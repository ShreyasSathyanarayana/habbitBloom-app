import BackButton from "@/components/ui/back-button";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";
type HeaderProps = {
  title: string;
  rightIcon?: React.ReactNode;
  headerIcon?: React.ReactNode;
  isLoading?: boolean;
};

const AnalyticsHeader = ({ title, headerIcon, isLoading }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      {/* <Skeleton show={isLoading}> */}
      <View style={styles.titleContainer}>
        {headerIcon}
        <ThemedText numberOfLines={1} style={{ fontFamily: "PoppinsSemiBold" }}>
          {title}
        </ThemedText>
      </View>
      {/* </Skeleton> */}
      <View
        style={{ width: horizontalScale(20), height: horizontalScale(20) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    borderBottomWidth: horizontalScale(1),
    // borderColor: "rgba(255, 255, 255, 0.15)",
    // marginBottom: verticalScale(10),
  },
  backButton: {
    marginBottom: 0,
    left: 0,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
});

export default AnalyticsHeader;
