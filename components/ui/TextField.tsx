import { StyleSheet, TextInput, View } from "react-native";
import React, { forwardRef } from "react";
import Label from "./Label";
import { horizontalScale } from "@/metric";
import { Rect } from "react-native-svg";
import { getFontSize } from "@/font";

interface TextFieldRawProps extends React.ComponentProps<typeof TextInput> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

export const TextFieldRaw = forwardRef<TextInput, TextFieldRawProps>(
  ({ rightIcon, leftIcon, disabled, value, error, success, ...rest }, ref) => {
    // console.log("value", value);
    // console.log(success);

    return (
      <View
        style={[
          styles.container,
          disabled ? { backgroundColor: "#f3f3f3" } : null,
          typeof value === "string" &&
            value.length > 0 && { borderColor: "white" },
          error && { borderColor: "rgba(255, 0, 0, 1)" },
          success && { borderColor: "green" },
        ]}
      >
        {leftIcon &&
          React.cloneElement(leftIcon as React.ReactElement, {
            width: 24,
            height: 24,
            opacity: typeof value === "string" && value.length > 0 ? 1 : 0.5,
          })}
        <TextInput
          ref={ref}
          style={[
            styles.textField,
            error && { color: "rgba(255, 0, 0, 1)" },
            success && { borderColor: "green" },
          ]}
          {...rest}
          placeholderTextColor={"rgba(81, 85, 98, 1)"}
          editable={!disabled}
        />
        {rightIcon}
      </View>
    );
  }
);

interface TextFieldProps
  extends React.ComponentProps<typeof Label>,
    React.ComponentProps<typeof TextFieldRaw> {}

const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, helperText, error, success, helperComponent, ...rest }, ref) => {
    return (
      <Label
        label={label}
        helperText={helperText}
        error={error}
        success={success}
        helperComponent={helperComponent}
      >
        <TextFieldRaw success={success} error={error} {...rest} ref={ref} />
      </Label>
    );
  }
);

export default TextField;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    minHeight: 58,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(205, 205, 205, 0.09)",
    backgroundColor: "rgba(60, 60, 67, 0.6)",
    paddingHorizontal: horizontalScale(16),
  },
  textField: {
    flex: 1,
    height: "100%",
    padding: 16,
    color: "white",
    fontFamily: "Poppins_500Medium",
    fontSize: getFontSize(14),
  },
});
