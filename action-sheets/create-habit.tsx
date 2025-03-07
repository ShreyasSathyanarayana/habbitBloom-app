import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import GoodHabitIcon from "@/assets/svg/good-habit.svg";
import BadHabitIcon from "@/assets/svg/bad-habit.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import RightArrow from "@/assets/svg/skip-icon.svg";

const CreateHabit = () => (
  <View>
    <ActionSheet
      containerStyle={{
        backgroundColor: "black", // Fix for Android transparency issue
        paddingBottom: horizontalScale(16),
      }}
      indicatorStyle={{
        backgroundColor: "white",
        marginTop: verticalScale(16),
        width: horizontalScale(80),
      }}
      gestureEnabled={true}
    >
      <TouchableOpacity style={styles.button}>
        <View
          style={{
            flexDirection: "row",
            gap: horizontalScale(12),
            alignItems: "center",
          }}
        >
          <View style={styles.icon}>
            <GoodHabitIcon
              width={horizontalScale(34)}
              height={horizontalScale(34)}
            />
          </View>
          <View style={{ gap: verticalScale(5) }}>
            <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
              Build Habits
            </ThemedText>
            <ThemedText style={{ fontSize: getFontSize(12) }}>
              Start good routines
            </ThemedText>
          </View>
        </View>
        <RightArrow width={horizontalScale(24)} height={horizontalScale(24)} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <View
          style={{
            flexDirection: "row",
            gap: horizontalScale(12),
            alignItems: "center",
          }}
        >
          <View style={styles.icon}>
            <BadHabitIcon
              width={horizontalScale(34)}
              height={horizontalScale(34)}
            />
          </View>
          <View style={{ gap: verticalScale(5) }}>
            <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
              Quit Habits
            </ThemedText>
            <ThemedText style={{ fontSize: getFontSize(12) }}>
              Break bad patterns
            </ThemedText>
          </View>
        </View>
        <RightArrow width={horizontalScale(24)} height={horizontalScale(24)} />
      </TouchableOpacity>
    </ActionSheet>
  </View>
);

export default CreateHabit;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: horizontalScale(16),
  },
  icon: {
    backgroundColor: "rgba(30, 30, 30, 1)",
    padding: horizontalScale(10),
    borderRadius: horizontalScale(8),
  },
});
