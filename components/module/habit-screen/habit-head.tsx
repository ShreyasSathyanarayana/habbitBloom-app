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

type Props = {
  onPressArchive?: (event: GestureResponderEvent) => void;
};

const HabitHead = ({ onPressArchive }: Props) => {
  return (
    <View style={styles.container}>
      <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>Habits</ThemedText>
      <TouchableHighlight onPress={onPressArchive}>
        <ArchiveIcon width={horizontalScale(22)} height={horizontalScale(22)} />
      </TouchableHighlight>
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
