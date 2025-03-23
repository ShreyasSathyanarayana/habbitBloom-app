import { getFontSize } from "@/font";
import { horizontalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button as Bun, ButtonProps } from "react-native-ui-lib";

const Button = ({
  style,
  outline,
  labelStyle,
  children,
  ...props
}: ButtonProps) => {
  return (
    <Bun
      labelStyle={[styles.labeStyle, labelStyle]}
      style={[
        outline ? styles.outLineBtn : styles.btnStyle,
        styles.generalStyle,
        style,
      ]}
      {...props}
    ></Bun>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: "rgba(138, 43, 226, 1)",
  },
  outLineBtn: {
    borderWidth: 1,
    borderColor: "rgba(138, 43, 226, 1)",
    backgroundColor: "transparent",
  },
  generalStyle: {
    borderRadius: horizontalScale(6),
    // backgroundColor: "rgba(138, 43, 226, 1)",
    borderColor: "rgba(138, 43, 226, 1)",
  },
  labeStyle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
    color: "white",
  },
});

export default Button;
