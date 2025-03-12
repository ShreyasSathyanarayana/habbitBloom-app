import { ThemedText } from "@/components/ui/theme-text";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import CalenderIcon from "@/assets/svg/calendar.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import Animated from "react-native-reanimated";
// import CircularProgress from "react-native-circular-progress-indicator";
import LinerGradientContainer from "@/components/ui/liner-gradient-container";
import { useQuery } from "@tanstack/react-query";
import { getHabitsByDate } from "@/api/api";
import CircularProgressIos from "@/components/ui/CircularProgress";
import CircularProgress from "react-native-circular-progress-indicator";

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
  const [progressDetails, setProgressDetails] = useState({
    completed: 0,
    total: 0,
  });
  const habitDetails = useQuery({
    queryKey: ["habitDetails", selectedWeek],
    queryFn: () => getHabitsByDate(weekDates[6]?.fullDate),
    enabled: selectedWeek === todayWeekNumber,
    // staleTime: 0,
  });

  useEffect(() => {
    if (habitDetails.data) {
      const completedCount = habitDetails.data?.filter(
        (habit) => habit.isCompleted
      )?.length;
      setProgressDetails({
        completed: completedCount || 0,
        total: habitDetails?.data?.length || 0,
      });
    }
  }, [habitDetails?.data]);

  // Get selected day's name or "Today"
  const selectedDay =
    selectedWeek === todayWeekNumber
      ? "Today"
      : weekDates.find((day) => day.weekNumber === selectedWeek)?.dayShort ||
        "Today";
  const progressPercentage =
    progressDetails.total > 0
      ? Math.min(
          100,
          Math.round((progressDetails.completed / progressDetails.total) * 100)
        )
      : 0; // Prevents values greater than 100

  // console.log(
  //   "Progress percentange==>",
  //   (progressDetails.completed / progressDetails.total) * 100
  // );

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
      {selectedWeek === todayWeekNumber && (
        <LinerGradientContainer
          style={{
            marginTop: verticalScale(24),
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(12),
          }}
        >
          {Platform.OS == "ios" && (
            <CircularProgressIos
              progress={progressPercentage}
              size={horizontalScale(45)}
              outerCircleColor="white"
              progressCircleColor="rgba(175, 180, 255, 1)"
              labelSize={12}
              strokeWidth={3}
              // labelStyle={{ fontFamily: "PoppinsMedium" }}
            />
          )}
          {Platform.OS == "android" && (
            <CircularProgress
              // key={progressKey}
              value={progressPercentage}
              initialValue={progressPercentage - 1}
              radius={horizontalScale(24)}
              maxValue={100}
              progressValueColor={"#fff"}
              inActiveStrokeColor="white"
              valueSuffix="%"
              allowFontScaling={false}
              titleFontSize={12}
              strokeColorConfig={[
                { color: "rgba(175, 180, 255, 1)", value: 0 },
                { color: "rgba(175, 180, 255, 1)", value: 49 },
                { color: "rgba(175, 180, 255, 1)", value: 100 },
              ]}
              inActiveStrokeWidth={4}
              activeStrokeWidth={4}
            />
          )}

          <View>
            <ThemedText style={{ fontSize: getFontSize(12) }}>
              {progressPercentage == 100
                ? "Congratulations! 🎉 You nailed it!"
                : "Your daily goals almost done! 🔥"}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: getFontSize(12),
                color: "rgba(175, 180, 255, 1)",
              }}
            >
              {progressDetails?.completed} of {progressDetails.total} completed
            </ThemedText>
          </View>
        </LinerGradientContainer>
      )}
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
