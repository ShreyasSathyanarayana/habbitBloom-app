import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import BackButton from "./back-button";
import { ThemedText } from "./theme-text";

const screenWidth = Dimensions.get("window").width;

// Props type definition
type HeaderProps = {
  title: string;
  rightIcon?: React.ReactNode;
  headerIcon?: React.ReactNode;
};

const Header = ({ title, rightIcon, headerIcon }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <View style={styles.titleContainer}>
        {headerIcon}
        <ThemedText
          // adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.titleText}
        >
          {title}
        </ThemedText>
      </View>
      <View style={styles.rightIconContainer}>{rightIcon}</View>
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
    width: "100%",
    borderBottomWidth: horizontalScale(1),
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
    // marginBottom: verticalScale(10),
    // maxWidth: screenWidth - horizontalScale(20),
  },
  backButton: {
    marginBottom: 0,
    left: 0,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    flexShrink: 1, // Ensures the title container resizes properly
  },
  titleText: {
    fontFamily: "PoppinsBold",
    flexShrink: 1, // Prevents text from overflowing
  },
  rightIconContainer: {
    minWidth: horizontalScale(24),
    minHeight: horizontalScale(24),
    paddingVertical: verticalScale(2),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
