import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { ThemedText } from "./theme-text";
import { horizontalScale, verticalScale } from "@/metric";

type PersonalizationProps = {
  item: any;
  disable: boolean;
  selected: boolean;
} & TouchableOpacityProps;

const PersonalizeButton = ({
  item,
  disable,
  selected,
  style,
  ...rest
}: PersonalizationProps) => {
  return (
    <TouchableOpacity
      {...rest}
      style={[
        styles.buttonStyle,
        selected && { borderColor: "rgba(255, 255, 255, 1)" },
        style,
      ]}
      disabled={disable}
    >
      <LinearGradient
        colors={
          disable
            ? ["rgba(27, 27, 27, 1)", "rgba(51, 50, 50, 1)"]
            : ["rgba(138, 43, 226, 0.78)", "#000000"]
        }
        start={disable ? { x: 0.5, y: 0 } : { x: 0.2, y: 0 }} // Adjust for 133.83° approximation
        end={disable ? { x: 0.5, y: 1 } : { x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ThemedText
          style={[
            styles.text,
            selected && { fontFamily: "PoppinsBold", color: "#FFFFFF" },
          ]}
        >
          {item.title}
        </ThemedText>
        {item.icon &&
          React.cloneElement(item.icon as React.ReactElement, {
            width: horizontalScale(76),
            height: horizontalScale(76),
            opacity: typeof selected === "boolean" && selected ? 1 : 0.5,
          })}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "rgba(166, 166, 166, 0.68)",
    // justifyContent: "space-between",
    borderRadius: 10, // Optional for rounded corners
    overflow: "hidden", // Ensure gradient doesn't overflow
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // padding: 10,
    paddingHorizontal: horizontalScale(24),
  },
  text: {
    color: "rgba(209, 209, 209, 0.78)", // Ensure text is readable on dark background
    fontFamily: "PoppinsMedium",
  },
});

export default PersonalizeButton;
