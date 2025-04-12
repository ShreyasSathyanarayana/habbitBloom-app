import React from "react";
import { Text, TextStyle } from "react-native";
import moment from "moment";
import { getFontSize } from "@/font";

interface TimeAgoOrTodayProps {
  createdAt: string; // Example: "2025-04-11T16:56:44.871959+00:00"
  style?: TextStyle;
}

const TimeAgoOrToday: React.FC<TimeAgoOrTodayProps> = ({
  createdAt,
  style,
}) => {
  const createdMoment = moment(createdAt);
  const now = moment();

  const isToday = createdMoment.isSame(now, "day");

  const displayText = isToday
    ? createdMoment.local().format("h:mm A") // local time like "4:56 PM"
    : createdMoment.fromNow(); // "2 days ago", etc.

  return (
    <Text
      style={[
        { color: "rgba(118, 118, 118, 1)", fontSize: getFontSize(12) },
        style,
      ]}
    >
      {displayText}
    </Text>
  );
};

export default TimeAgoOrToday;
