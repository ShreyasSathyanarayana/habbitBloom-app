import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { fetchYearlyHabitProgress } from "@/api/api"; // Import API function

type Props = {
  habitId: string;
};

type DayStatus = {
  date: string;
  status: boolean | null;
};

const generateYearData = (): Record<string, DayStatus[]> => {
  const yearData: Record<string, DayStatus[]> = {};
  for (let month = 0; month < 12; month++) {
    const daysInMonth = moment().month(month).daysInMonth();
    const monthData = Array.from({ length: daysInMonth }, (_, i) => ({
      date: moment()
        .month(month)
        .date(i + 1)
        .format("YYYY-MM-DD"),
      status: null, // Default untracked
    }));
    yearData[moment().month(month).format("MMMM")] = monthData;
  }
  return yearData;
};

const mergeHabitData = (
  yearData: Record<string, DayStatus[]>,
  habitData: DayStatus[]
): Record<string, DayStatus[]> => {
  const habitMap = new Map(habitData.map((item) => [item.date, item.status]));
  const mergedData: Record<string, DayStatus[]> = {};

  Object.keys(yearData).forEach((month) => {
    mergedData[month] = yearData[month].map((day) => ({
      date: day.date,
      status: habitMap.get(day.date) ?? null,
    }));
  });

  return mergedData;
};

const YearMap: React.FC<Props> = ({ habitId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["yearlyHabitProgress", habitId],
    queryFn: () => fetchYearlyHabitProgress(habitId),
  });

  const [yearData, setYearData] = useState<Record<string, DayStatus[]>>(
    generateYearData()
  );

  useEffect(() => {
    if (data?.data) {
      setYearData((prev) => mergeHabitData(prev, data.data));
    }
  }, [data]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#BB86FC" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  const renderMonth = ({ item }: { item: string }) => {
    return (
      <View style={styles.monthContainer}>
        <Text style={styles.monthTitle}>{item}</Text>
        <FlatList
          data={yearData[item]}
          keyExtractor={(day) => day.date}
          numColumns={7} // 7 days per week
          renderItem={({ item }) => {
            const backgroundColor =
              item.status === true
                ? "#4CAF50" // ✅ Green (Completed)
                : item.status === false
                ? "#F44336" // ❌ Red (Missed)
                : "#444"; // ⚫ Grey (Not tracked)

            return <View style={[styles.dayBox, { backgroundColor }]} />;
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(yearData)}
        keyExtractor={(item) => item}
        numColumns={2} // Two months per row
        renderItem={renderMonth}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#121212",
  },
  gridContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  monthContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 8,
    alignItems: "center",
  },
  monthTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dayBox: {
    width: 15,
    height: 15,
    margin: 2,
    borderRadius: 3,
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

export default YearMap;
