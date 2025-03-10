import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import BackButton from "./back-button";
import { ThemedText } from "./theme-text";

type HeaderProps = {
  title: string;
  rightIcon?: React.ReactNode;
};

const Header = ({ title, rightIcon }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <BackButton style={{ marginBottom: 0, left: 0 }} />
      <ThemedText style={{ fontFamily: "PoppinsBold" }}>{title}</ThemedText>
      {!rightIcon && (
        <View
          style={{ width: horizontalScale(24), height: horizontalScale(24) }}
        >
          {rightIcon}
        </View>
      )}
      {rightIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(10),
    // padding: horizontalScale(16),
  },
});

export default Header;
