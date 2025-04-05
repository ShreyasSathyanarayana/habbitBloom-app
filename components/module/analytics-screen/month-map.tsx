import { fetchHabitProgressFromCreation } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getFontSize } from "@/font";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

type Props = {
  habitId: string;
};

const getMarkedDates = (data: { date: string; status: boolean | null }[]) => {
  const markedDates: { [key: string]: any } = {};

  const today = moment().local().format("YYYY-MM-DD");

  data.forEach((item) => {
    const isToday = item.date === today;
    if (item.status === true) {
      markedDates[item.date] = {
        customStyles: {
          container: {
            width: horizontalScale(36),
            height: horizontalScale(36),
            borderRadius: horizontalScale(8), // Rectangular shape
            backgroundColor: "rgba(131, 191, 146, 0.3)", // Selected habit color
            justifyContent: "center",
            alignItems: "center",
            borderWidth: horizontalScale(2),
            borderColor: "rgba(52, 199, 89, 1)",
          },
          text: {
            color: "#FFF", // Text color
            fontFamily: "PoppinsMedium",
            includeFontPadding: false,
            fontSize: getFontSize(16),
          },
        },
      };
    } else if (item.status === false) {
      markedDates[item.date] = {
        customStyles: {
          container: {
            width: horizontalScale(36),
            height: horizontalScale(36),
            borderRadius: horizontalScale(8), // Rectangular shape
            backgroundColor: isToday ? "transparent" : "rgba(255, 59, 48, 0.3)", // Missed habit color
            justifyContent: "center",
            alignItems: "center",
            borderWidth: horizontalScale(2),
            borderColor: isToday
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 59, 48, 0.3)",
          },
          text: {
            color: isToday
              ? "rgba(255, 255, 255, 1)"
              : "rgba(179, 179, 179, 0.7)", // Text color
            fontFamily: "PoppinsMedium",
            includeFontPadding: false,
            fontSize: getFontSize(16),
          },
        },
      };
    } else if (item.status === null) {
      markedDates[item.date] = {
        customStyles: {
          container: {
            width: horizontalScale(36),
            height: horizontalScale(36),
            borderRadius: 5, // Rectangular shape
            backgroundColor: "rgba(217, 217, 217, 0.2)", // No data color
            justifyContent: "center",
            alignItems: "center",
          },
          text: {
            color: isToday
              ? "rgba(138, 43, 226, 1)"
              : "rgba(179, 179, 179, 0.7)", // Text color
            fontFamily: "PoppinsMedium",
            includeFontPadding: false,
            fontSize: getFontSize(16),
          },
        },
      };
    }
  });

  return markedDates;
};

const MonthMap = ({ habitId }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyHabitProgress", habitId],
    queryFn: () => fetchHabitProgressFromCreation(habitId),
  });

  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (data?.data) {
      setMarkedDates(getMarkedDates(data.data));
    }
  }, [data]);

  if (isLoading) {
    return <Skeleton width={"100%"} height={verticalScale(300)} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error fetching data</ThemedText>
      </View>
    );
  }

  return (
    <Animated.View
      key={"calender-view"}
      entering={FadeInRight.springify().damping(40).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(40).stiffness(200)}
      // style={{ marginBottom: verticalScale(20) }}
    >
      <Calendar
        markedDates={markedDates}
        markingType="custom" // 👈 Enables custom rectangular styles
        hideExtraDays
        enableSwipeMonths={false}
        disableMonthChange
        style={styles.calendar}
        theme={{
          backgroundColor: "#0000",
          calendarBackground: "transparent",
          textSectionTitleColor: "#FFF",
          dayTextColor: "#FFF",
          todayTextColor: "rgba(138, 43, 226, 1)",
          arrowColor: "#FFF",
          monthTextColor: "#FFF",
          calenderBackground: "#0000",
          textDayHeaderFontFamily: "PoppinsMedium",
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: "transparent",
    borderRadius: horizontalScale(16),
    // padding: 5,
    borderWidth: horizontalScale(1),
    borderColor: "rgba(138, 43, 226, 1)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF4444",
  },
});

export default MonthMap;
