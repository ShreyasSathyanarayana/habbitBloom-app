import React from "react";
import { StyleSheet, View } from "react-native";
import PieIcon from "@/assets/svg/pie-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import PieChart from "react-native-pie-chart";
import { Skeleton } from "moti/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getCompletedAndPendingDays, getHabitCompletionStats } from "@/api/api";

type Props = {
  habitId: string;
};
const _iconSize = horizontalScale(24);

const SuccessFailAnalytics = ({ habitId }: Props) => {
  const widthAndHeight = horizontalScale(100);
  const getHabitStatsQuery = useQuery({
    queryKey: ["success-fail", habitId],
    queryFn: () => {
      return getCompletedAndPendingDays(habitId);
    },
    enabled: !!habitId,
  });
  console.log("Sample==>", JSON.stringify(getHabitStatsQuery.data, null, 2));

  const series = [
    {
      value: getHabitStatsQuery?.data?.completedDays ?? 0,
      color: "rgba(138, 43, 226, 1)",
      label: {
        text: getHabitStatsQuery?.data?.completedDays?.toString() ?? "0",
        fontWeight: "bold",
        fill: "#fff",
      },
    }, // done
    {
      value: getHabitStatsQuery?.data?.pendingDays ?? 1,
      color: "rgba(255, 20, 147, 1)",
      label: {
        text: getHabitStatsQuery?.data?.pendingDays?.toString() ?? "1",
        fontWeight: "bold",
        fill: "#fff",
      },
    }, //pending
  ];
  if (getHabitStatsQuery?.status === "error") {
    return null;
  }

  return (
    <View>
      <View style={styles.header}>
        <PieIcon width={_iconSize} height={_iconSize} />
        <ThemedText style={{ fontSize: getFontSize(12) }}>
          Success/Fail
        </ThemedText>
      </View>
      <View style={styles.instructionContainer}>
        <View style={styles.row}>
          <View
            style={[styles.dot, { backgroundColor: "rgba(138, 43, 226, 1)" }]}
          />
          <ThemedText
            style={{ fontSize: getFontSize(10), fontFamily: "PoppinsSemiBold" }}
          >
            Done
          </ThemedText>
        </View>
        <View style={styles.row}>
          <View
            style={[styles.dot, { backgroundColor: "rgba(255, 20, 147, 1)" }]}
          />
          <ThemedText
            style={{ fontSize: getFontSize(10), fontFamily: "PoppinsSemiBold" }}
          >
            Pending
          </ThemedText>
        </View>
      </View>
      <View
        style={{ alignItems: "center", paddingVertical: verticalScale(16) }}
      >
        <Skeleton
          show={getHabitStatsQuery?.isLoading}
          radius={"round"}
          width={widthAndHeight}
        >
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            cover={0.45}
          />
        </Skeleton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  instructionContainer: {
    gap: horizontalScale(6),
    position: "absolute",
    right: 0,
    top: verticalScale(6),
  },
  dot: {
    width: horizontalScale(6),
    height: horizontalScale(6),
    borderRadius: horizontalScale(6),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
});

export default SuccessFailAnalytics;
