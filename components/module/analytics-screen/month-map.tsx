import { fetchHabitProgressFromCreation } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getFontSize } from "@/font";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

type Props = {
  habitId: string;
};

const getMarkedDates = (data: { date: string; status: boolean | null }[]) => {
  const markedDates: Record<string, any> = {};
  const today = moment().local().format("YYYY-MM-DD");

  for (const { date, status } of data) {
    const isToday = date === today;
    const baseContainerStyle = {
      width: horizontalScale(36),
      height: horizontalScale(36),
      borderRadius: horizontalScale(8),
      justifyContent: "center",
      alignItems: "center",
    };

    if (status === true) {
      markedDates[date] = {
        customStyles: {
          container: {
            ...baseContainerStyle,
            backgroundColor: "rgba(131, 191, 146, 0.3)",
            borderWidth: horizontalScale(2),
            borderColor: "rgba(52, 199, 89, 1)",
          },
          text: {
            color: "#FFF",
            fontFamily: "PoppinsMedium",
            fontSize: getFontSize(16),
            includeFontPadding: false,
          },
        },
      };
    } else if (status === false) {
      markedDates[date] = {
        customStyles: {
          container: {
            ...baseContainerStyle,
            backgroundColor: isToday ? "transparent" : "rgba(255, 59, 48, 0.3)",
            borderWidth: horizontalScale(2),
            borderColor: isToday
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 59, 48, 0.3)",
          },
          text: {
            color: isToday
              ? "rgba(255, 255, 255, 1)"
              : "rgba(179, 179, 179, 0.7)",
            fontFamily: "PoppinsMedium",
            fontSize: getFontSize(16),
            includeFontPadding: false,
          },
        },
      };
    } else if (status === null) {
      markedDates[date] = {
        customStyles: {
          container: {
            ...baseContainerStyle,
            backgroundColor: "rgba(217, 217, 217, 0.2)",
          },
          text: {
            color: isToday
              ? "rgba(138, 43, 226, 1)"
              : "rgba(179, 179, 179, 0.7)",
            fontFamily: "PoppinsMedium",
            fontSize: getFontSize(16),
            includeFontPadding: false,
          },
        },
      };
    }
  }

  return markedDates;
};

const MonthMap = ({ habitId }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyHabitProgress", habitId],
    queryFn: () => fetchHabitProgressFromCreation(habitId),
    enabled: !!habitId,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins (optional boost)
    select: (res) => res?.data ?? [], // Direct data selection
  });

  const markedDates = useMemo(() => {
    return data?.length ? getMarkedDates(data??[]) : {};
  }, [data]);

  if (isLoading) {
    return <Skeleton width="100%" height={verticalScale(300)} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error fetching data</ThemedText>
      </View>
    );
  }

  return (
    <View
      key="calendar-view"
      // entering={FadeInRight.springify().damping(40).stiffness(200)}
      // exiting={FadeOutLeft.springify().damping(40).stiffness(200)}
    >
      <Calendar
        markedDates={markedDates}
        markingType="custom"
        hideExtraDays
        enableSwipeMonths={false}
        disableMonthChange
        style={styles.calendar}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: "#FFF",
          dayTextColor: "#FFF",
          todayTextColor: "rgba(138, 43, 226, 1)",
          arrowColor: "#FFF",
          monthTextColor: "#FFF",
          textDayHeaderFontFamily: "PoppinsMedium",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: "transparent",
    borderRadius: horizontalScale(16),
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
