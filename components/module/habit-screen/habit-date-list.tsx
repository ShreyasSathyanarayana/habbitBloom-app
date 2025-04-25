import { FlatList, View } from "react-native";
import { HabitProgressEntry } from "@/api/api";
import { horizontalScale, verticalScale } from "@/metric";
import React, { memo } from "react";
import WeekName from "./week-name";
import HabitDateButton from "./habit-date-button";

type Props = {
  habitId: string;
  habitProgress: HabitProgressEntry[];
};

const HabitDateList = ({ habitId, habitProgress }: Props) => {
  return (
    <FlatList
      key={"habit-date-list" + habitId}
      data={habitProgress}
      scrollEnabled={false}
      horizontal
      keyExtractor={(item) => item.date}
      contentContainerStyle={{
        paddingVertical: verticalScale(16),
        justifyContent: "space-between",
        flex: 1,
        // gap: verticalScale(16),
      }}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      renderItem={({ item }) => (
        <View style={{ alignItems: "center", gap: verticalScale(6) }}>
          <WeekName date={item.date} />
          <HabitDateButton
            date={item.date}
            status={item.status}
            habitId={habitId}
          />
        </View>
      )}
    />
  );
};

export default memo(HabitDateList);
