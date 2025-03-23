import { getCompletedHabitStats } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  habitId: string;
};

const TimesCompletedDetails = ({ habitId }: Props) => {
  const getCompletedDetailsQuery = useQuery({
    queryKey: ["completed-details", habitId],
    queryFn: () => {
      return getCompletedHabitStats(habitId);
    },
    enabled: !!habitId,
  });
  // console.log(
  //   "completed details",
  //   JSON.stringify(getCompletedDetailsQuery.data, null, 2)
  // );

  return (
    <View style={{ gap: verticalScale(16) }}>
      <View style={styles.row}>
        <View style={styles.column}>
          <ThemedText style={styles.title}>This week</ThemedText>
          <ThemedText style={styles.numberStyle}>
            {getCompletedDetailsQuery.data?.weekly?.completed ?? 0}
          </ThemedText>
        </View>
        <View style={styles.column}>
          <ThemedText style={styles.title}>This month</ThemedText>
          <ThemedText style={styles.numberStyle}>
            {getCompletedDetailsQuery.data?.monthly?.completed}
          </ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <ThemedText style={styles.title}>This year</ThemedText>
          <ThemedText style={styles.numberStyle}>
            {getCompletedDetailsQuery?.data?.yearly?.completed}
          </ThemedText>
        </View>
        <View style={styles.column}>
          <ThemedText style={styles.title}>Overall</ThemedText>
          <ThemedText style={styles.numberStyle}>
            {getCompletedDetailsQuery?.data?.completed}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: getFontSize(12),
    fontFamily: "PoppinsMedium",
  },
  column: {
    flex: 1,
  },
  numberStyle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsSemiBold",
  },
});

export default TimesCompletedDetails;
