import { horizontalScale } from "@/metric";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from "react-native";

type props = {
  children?: React.ReactNode;
  colors?: [string, string, ...string[]];
} & ViewProps;

const LinerGradientContainer = ({ children, style, colors }: props) => {
  return (
    <LinearGradient
      colors={colors ? colors : ["#8A2BE2", "#34127E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      //   style={styles.card}
      style={[
        { padding: horizontalScale(16), borderRadius: horizontalScale(16) },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({});

export default LinerGradientContainer;
