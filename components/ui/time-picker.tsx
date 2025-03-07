import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Label from "./Label";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
} from "react-native-actions-sheet";
import { Picker } from "react-native-wheel-pick";

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

const generateNumberArray = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) =>
    (start + i).toString().padStart(2, "0")
  );
};

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  success,
  disabled,
  rightIcon,
  leftIcon,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmPm, setSelectedAmPm] = useState("AM");

  const showPicker = () => {
    if (disabled) return;
    SheetManager.show("time-picker-sheet");
  };

  const confirmTime = () => {
    const formattedTime = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;
    onChange(formattedTime);
    SheetManager.hide("time-picker-sheet");
  };

  return (
    <Label label={label} error={error} success={success}>
      <TouchableOpacity
        style={[styles.container, disabled && { backgroundColor: "#f3f3f3" }]}
        onPress={showPicker}
        activeOpacity={0.9}
      >
        <View style={styles.row}>
          {leftIcon}
          <Text style={[styles.text, error && { color: "red" }]}>
            {value || "Select Time"}
          </Text>
        </View>
        {rightIcon}
      </TouchableOpacity>

      <ActionSheet
        containerStyle={styles.sheetContainer}
        indicatorStyle={styles.sheetIndicator}
        gestureEnabled={true}
        ref={actionSheetRef}
        id="time-picker-sheet"
      >
        <View style={styles.pickerContainer}>
          <Picker
            isLoop={true}
            style={styles.picker}
            textColor={"white"}
            selectedValue={selectedHour}
            pickerData={generateNumberArray(1, 12)}
            onValueChange={(value) => setSelectedHour(value)}
          />
          <Text style={styles.separator}>:</Text>
          <Picker
            style={styles.picker}
            textColor={"white"}
            isLoop={true}
            selectedValue={selectedMinute}
            pickerData={generateNumberArray(0, 59)}
            onValueChange={(value) => setSelectedMinute(value)}
          />
          <Text style={styles.separator}>:</Text>
          <Picker
            style={[styles.picker, { width: "25%" }]}
            textColor={"white"}
            selectedValue={selectedAmPm}
            pickerData={["AM", "PM"]}
            onValueChange={(value) => setSelectedAmPm(value)}
          />
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmTime}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ActionSheet>
    </Label>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
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
    color: "white",
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  sheetContainer: {
    backgroundColor: "rgba(28, 28, 30, 1)",
    paddingBottom: horizontalScale(16),
  },
  sheetIndicator: {
    backgroundColor: "white",
    marginTop: verticalScale(16),
    width: horizontalScale(80),
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(5),
  },
  picker: {
    backgroundColor: "transparent",
    width: "30%",
  },
  separator: {
    color: "white",
    fontSize: getFontSize(24),
    fontFamily: "PoppinsBold",
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: verticalScale(12),
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: horizontalScale(20),
  },
  confirmButtonText: {
    color: "white",
    fontSize: getFontSize(16),
    fontFamily: "PoppinsBold",
  },
});
