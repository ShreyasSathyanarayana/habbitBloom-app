import { StyleSheet, TextInput, View } from "react-native";
import React, { forwardRef } from "react";
import Label from "./Label";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";

interface TextFieldRawProps extends React.ComponentProps<typeof TextInput> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  textarea?: boolean;
}

export const TextFieldRaw = forwardRef<TextInput, TextFieldRawProps>(
  (
    { rightIcon, leftIcon, disabled, value, error, success, textarea, ...rest },
    ref
  ) => {
    const safeValue = value ?? "";

    return (
      <View
        style={[
          styles.container,
          disabled && { opacity: 0.7 },
          typeof safeValue === "string" &&
            safeValue.length > 0 && { borderColor: "white" },
          error
            ? { borderColor: "rgba(255, 0, 0, 1)" }
            : success
            ? { borderColor: "green" }
            : {},
          textarea && {
            height: verticalScale(150),
            alignItems: "flex-start",
            paddingVertical: verticalScale(16),
          },
        ]}
      >
        {leftIcon &&
          React.isValidElement(leftIcon) &&
          React.cloneElement(leftIcon, {
            width: horizontalScale(24),
            height: horizontalScale(24),
            opacity: safeValue.length > 0 ? 1 : 0.5,
          })}
        <TextInput
          ref={ref as React.RefObject<TextInput>}
          allowFontScaling={false}
          textAlignVertical="top"
          style={[
            styles.textField,
            error && { color: "rgba(255, 0, 0, 1)" },
            success && { borderColor: "green" },
            {
              includeFontPadding: false,
              textShadowColor: "transparent",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 0,
            },
            textarea && { paddingVertical: 0 },
          ]}
          value={safeValue}
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
    height: 58,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(205, 205, 205, 0.09)",
    backgroundColor: "rgba(60, 60, 67, 0.6)",
    paddingHorizontal: horizontalScale(16) || 16, // Fallback to 16 if undefined
  },
  textField: {
    flex: 1,
    height: "100%",
    padding: 16,
    color: "white",
    fontFamily: "PoppinsMedium",
    fontSize: getFontSize(14),
  },
});
