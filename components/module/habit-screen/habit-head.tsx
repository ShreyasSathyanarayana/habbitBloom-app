import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import ArchiveIcon from "@/assets/svg/archive-icon.svg";
import { horizontalScale, verticalScale } from "@/metric";
import HabitCompleteIcon from "@/assets/svg/habit-completed-icon.svg";
import { router } from "expo-router";

type Props = {
  onPressArchive?: (event: GestureResponderEvent) => void;
};
const _iconSize = horizontalScale(22);
const HabitHead = ({ onPressArchive }: Props) => {
  return (
    <View style={styles.container}>
      <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>Habits</ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(12),
        }}
      >
        <TouchableHighlight
          onPress={() => router.push("/(protected)/completed-habits")}
        >
          <HabitCompleteIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
        <TouchableHighlight onPress={onPressArchive}>
          <ArchiveIcon width={_iconSize} height={_iconSize} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(12),
    marginBottom: verticalScale(16),
  },
});

export default HabitHead;
