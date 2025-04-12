import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  FlatList,
} from "react-native-actions-sheet";
import Label from "./Label";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import UpdownActiveIcon from "@/assets/svg/up-down-active.svg";
import ActionSheetButton from "../action-sheet/actionsheet-button";

export interface Option {
  label: string;
  value: any;
  icon?: React.ReactNode;
}

interface DropdownFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  helperComponent?: React.ReactNode;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

const _iconSize = horizontalScale(24);

const DropdownField = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  helperText,
  error,
  success,
  helperComponent,
  disabled = false,
  leftIcon,
}: DropdownFieldProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setSelectedLabel(option.label);
    actionSheetRef.current?.hide();
  };

  return (
    <>
      <Label
        label={label}
        helperText={helperText}
        error={error}
        success={success}
        helperComponent={helperComponent}
      >
        <TouchableOpacity
          style={[
            styles.container,
            selectedLabel && { borderColor: "#FFFF" },
            disabled && { backgroundColor: "#f3f3f3" },
            error
              ? { borderColor: "rgba(255, 0, 0, 1)" }
              : success
              ? { borderColor: "green" }
              : {},
          ]}
          onPress={() => actionSheetRef.current?.show()}
          disabled={disabled}
          activeOpacity={0.8}
        >
          {leftIcon && leftIcon}
          <Text style={[styles.text, !value && { color: "#aaa" }]}>
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </Text>
          <UpdownActiveIcon width={_iconSize} height={_iconSize} />
        </TouchableOpacity>
      </Label>

      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          backgroundColor: "black", // Fix for Android transparency issue
          paddingBottom: horizontalScale(16),
          paddingHorizontal: horizontalScale(16),
          // paddingVertical: verticalScale(24),
        }}
        indicatorStyle={{
          backgroundColor: "white",
          marginTop: verticalScale(16),
          width: horizontalScale(80),
          marginBottom: verticalScale(24),
        }}
        gestureEnabled={true}
      >
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{
            gap: verticalScale(24),
          }}
          style={{
            paddingBottom: verticalScale(16),
          }}
          renderItem={({ item }) => (
            <ActionSheetButton
              buttonName={item.label}
              onPress={() => handleSelect(item)}
              leftIcon={item?.icon ?? null}
              selected={item.value === value}
            />
          )}
        />
      </ActionSheet>
    </>
  );
};

export default DropdownField;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    height: 58,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(205, 205, 205, 0.09)",
    backgroundColor: "rgba(60, 60, 67, 0.6)",
    paddingHorizontal: horizontalScale(16),
    justifyContent: "space-between",
  },
  text: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
    color: "white",
    flex: 1,
    marginLeft: horizontalScale(10),
  },
  sheet: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: getFontSize(16),
    color: "#FFFF",
    fontFamily: "PoppinsRegular",
  },
});
