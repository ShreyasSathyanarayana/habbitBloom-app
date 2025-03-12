import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import CalenderIcon from "@/assets/svg/calendar.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import Animated from "react-native-reanimated";

const screenWidth = Dimensions.get("window").width - horizontalScale(32);
const itemWidth = screenWidth / 9; // Divide equally for 7 days


const getLast7Days = () => {
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i); // Subtract i days from today

    return {
      dateNumber: date.getDate(), // Get only the date (e.g., 24)
      fullDate: date.toISOString().split("T")[0], // Get full date in YYYY-MM-DD format
      dayShort: date.toLocaleDateString("en-US", { weekday: "short" }), // Get 3-letter day (e.g., Mon)
      weekNumber: date.getDay(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    };
  }).reverse(); // Reverse to maintain order from past to today
};

const getMonthAndYear = () => {
  const today = new Date();
  const monthName = today.toLocaleString("en-US", { month: "long" }); // "March"
  const year = today.getFullYear(); // 2024
  return `${monthName} ${year}`;
};

type HabitHeadProps = {
  onPress: (val: number, date: string) => void;
  selectedWeek: number;
};

const HabitHead = ({ onPress, selectedWeek }: HabitHeadProps) => {
  const weekDates = getLast7Days();
  const todayWeekNumber = new Date().getDay();

  // Get selected day's name or "Today"
  const selectedDay =
    selectedWeek === todayWeekNumber
      ? "Today"
      : weekDates.find((day) => day.weekNumber === selectedWeek)?.dayShort ||
        "Today";

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: verticalScale(12),
          alignItems: "center",
          paddingBottom: verticalScale(16),
        }}
      >
        <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
          {selectedDay}
        </ThemedText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(4),
          }}
        >
          <CalenderIcon
            width={horizontalScale(16)}
            height={horizontalScale(16)}
          />
          <ThemedText style={{ fontSize: getFontSize(12) }}>
            {getMonthAndYear()}
          </ThemedText>
        </View>
      </View>
      <FlatList
        data={weekDates}
        horizontal
        contentContainerStyle={{
          width: screenWidth,
          justifyContent: "space-between",
          gap: horizontalScale(10),
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item.weekNumber, item.fullDate)}
              style={[
                styles.weekBtn,
                { width: itemWidth },
                selectedWeek === item.weekNumber && {
                  backgroundColor: "rgba(138, 43, 226, 1)",
                },
              ]}
            >
              <ThemedText
                style={[
                  {
                    fontSize: getFontSize(12),
                    color: "rgba(157, 178, 206, 1)",
                  },
                  selectedWeek === item.weekNumber && { color: "white" },
                ]}
              >
                {item.dayShort}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: getFontSize(14),
                  fontFamily: "PoppinsSemiBold",
                }}
              >
                {item.dateNumber}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  weekBtn: {
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 1)",
    paddingVertical: verticalScale(8),
    borderRadius: horizontalScale(6),
  },
});

export default HabitHead;
