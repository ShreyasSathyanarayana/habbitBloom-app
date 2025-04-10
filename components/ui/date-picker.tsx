import { StyleSheet, TextInput, View, Pressable, Text } from "react-native";
import React, { useState, useEffect, forwardRef } from "react";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import Label from "./Label";
import { horizontalScale } from "@/metric";
import { getFontSize } from "@/font";
import { ThemedText } from "./theme-text";

interface DateInputProps {
  value?: string;
  onChange?: (date: string) => void;
  mode?: "date" | "time";
  placeholder?: string;
  label?: any;
  helperText?: any;
  error?: any;
  success?: any;
  helperComponent?: any;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inActiveLeftIcon?: React.ReactNode;
  inActiveRightIcon?: React.ReactNode;
  minimumDate?: Date;
}

const DateInputV2 = forwardRef<TextInput, DateInputProps>(
  (
    {
      value,
      onChange,
      mode = "date",
      placeholder,
      disabled,
      label,
      helperText,
      error,
      success,
      helperComponent,
      leftIcon,
      rightIcon,
      inActiveLeftIcon,
      inActiveRightIcon,
      minimumDate,
    },
    ref
  ) => {
    const [date, setDate] = useState<Date | null>(null);
    const [isPickerVisible, setPickerVisible] = useState(false);

    useEffect(() => {
      if (value) {
        setDate(new Date(value));
      } else {
        setDate(null);
      }
    }, [value]);

    const handleConfirm = (selectedDate: Date) => {
      if (minimumDate && selectedDate < minimumDate) {
        setPickerVisible(false);
        setDate(minimumDate);
        onChange?.(minimumDate.toISOString());
      } else {
        setPickerVisible(false);
        setDate(selectedDate);
        onChange?.(selectedDate.toISOString()); // Output as ISO string in UTC format
      }
    };

    return (
      <View style={styles.container}>
        <Label
          label={label}
          helperText={helperText}
          error={error}
          success={success}
          helperComponent={helperComponent}
        >
          <Pressable
            onPress={() => !disabled && setPickerVisible(true)}
            style={[styles.inputContainer, disabled && styles.disabled]}
          >
            {value && leftIcon && <View style={styles.icon}>{leftIcon}</View>}
            {!value && inActiveLeftIcon && (
              <View style={styles.icon}>{inActiveLeftIcon}</View>
            )}

            <Text ref={ref} style={styles.inputText}>
              {date ? (
                moment(date).format(mode === "time" ? "hh:mm a" : "YYYY-MM-DD")
              ) : (
                <ThemedText
                  style={{
                    color: "rgba(81, 85, 98, 1)",
                    fontFamily: "PoppinsMedium",
                  }}
                >
                  {placeholder || ""}
                </ThemedText>
              )}
            </Text>

            {value && rightIcon && <View style={styles.icon}>{rightIcon}</View>}
            {!value && inActiveRightIcon && (
              <View style={styles.icon}>{inActiveRightIcon}</View>
            )}
          </Pressable>
        </Label>

        <DateTimePicker
          // themeVariant="dark"
          minimumDate={minimumDate}
          isVisible={isPickerVisible}
          mode={mode}
          date={date || new Date()}
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
        />
      </View>
    );
  }
);

export default DateInputV2;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    borderRadius: horizontalScale(12),
    borderWidth: horizontalScale(2),
    borderColor: "rgba(205, 205, 205, 0.09)",
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "rgba(60, 60, 67, 0.6)",
    gap: horizontalScale(10),
  },
  inputText: {
    flex: 1,
    fontFamily: "PoppinsMedium",
    fontSize: getFontSize(16),
    color: "white",
    // textAlign: "center",
  },
  disabled: {
    backgroundColor: "#f0f0f0",
  },
  icon: {
    // paddingHorizontal: horizontalScale(8),
  },
});
