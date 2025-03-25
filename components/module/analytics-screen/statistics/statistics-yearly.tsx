import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AnalyticsBar from "../analytics-bar";
import WeeklyGraph from "./weekly-graph";
import { verticalScale } from "@/metric";
import MontlyGraph from "./montly-graph";
import YearlyGraph from "./yearly-graph";
import PagerView from "react-native-pager-view";
type Props = {
  habitId: string;
};

const StatisticsYearly = ({ habitId }: Props) => {
  const menu = ["Week", "Month", "Year"];
  const [selectedMenu, setSeletedMenu] = useState(menu[0]);
  const data = [
    <WeeklyGraph habitId={habitId} />,
    <MontlyGraph habitId={habitId} />,
    <YearlyGraph habitId={habitId} />,
  ];
  return (
    <View style={{ flex: 1 }}>
      <AnalyticsBar
        menu={menu}
        onChangeMenu={(item, index) => setSeletedMenu(item)}
      />
      {selectedMenu === "Week" && <WeeklyGraph habitId={habitId} />}
      {selectedMenu === "Month" && <MontlyGraph habitId={habitId} />}
      {selectedMenu === "Year" && <YearlyGraph habitId={habitId} />}
    </View>
  );
};

const styles = StyleSheet.create({});

export default StatisticsYearly;
