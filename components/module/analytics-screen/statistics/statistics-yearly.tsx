import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import AnalyticsBar from "../analytics-bar";
import WeeklyGraph from "./weekly-graph";
import MontlyGraph from "./montly-graph";
import YearlyGraph from "./yearly-graph";
import { verticalScale } from "@/metric";

type Props = {
  habitId: string;
};

const MENU_OPTIONS = ["Week", "Month", "Year"];

const StatisticsYearly = ({ habitId }: Props) => {
  const [selectedMenu, setSelectedMenu] = useState(MENU_OPTIONS[0]);

  const handleMenuChange = useCallback((item: string) => {
    setSelectedMenu(item);
  }, []);

  const renderGraph = () => {
    switch (selectedMenu) {
      case "Week":
        return <WeeklyGraph habitId={habitId} />;
      case "Month":
        return <MontlyGraph habitId={habitId} />;
      case "Year":
        return <YearlyGraph habitId={habitId} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AnalyticsBar
        menu={MENU_OPTIONS}
        selectedMenu={selectedMenu}
        onChangeMenu={(item) => handleMenuChange(item)}
      />
      <View style={styles.graphContainer}>{renderGraph()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphContainer: {
    minHeight: verticalScale(200),
    justifyContent: "flex-end",
  },
});

export default StatisticsYearly;
