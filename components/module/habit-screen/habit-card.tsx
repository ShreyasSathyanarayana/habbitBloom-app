import React from "react";
import { StyleSheet, View, Text, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import { getCategoryByName } from "@/utils/constants";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHabitStreak, markHabitStatus } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
import { getFontSize } from "@/font";

type HabitProgress = {
  status: boolean;
};

type HabitProps = {
  id: string;
  habit_name: string;
  category: string;
  reminder_time: string; // Format: "HH:MM:SS"
  frequency: number[]; // Array of numbers (days of the week)
  habit_color: string; // RGBA color format
  habit_progress?: HabitProgress[]; // Optional since it might be empty
};
const { width } = Dimensions.get("window");
const _cardWidth = (width - horizontalScale(32) - horizontalScale(17)) / 2;

const HabitCard = (props: HabitProps) => {
  const { habit_name, category, habit_color, habit_progress } = props;
  const queryClient = useQueryClient();
  const categoryDetails = getCategoryByName(category);
  const toast = useToast();
  const streakDetails = useQuery({
    queryKey: ["streaks", props.id],
    queryFn: () => {
      return getHabitStreak(props.id);
    },
  });
  const mutation = useMutation({
    mutationFn: async () => {
      const newStatus = !habit_progress?.[0]?.status; // Properly toggle status
      return markHabitStatus(props.id, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habitDetails"] });
      queryClient.invalidateQueries({ queryKey: ["streaks", props.id] });
    },
    onError: (error) => {
      console.error("markHabitAsCompleted error", error);
      toast.show(error.message, {
        type: "warning",
      });
    },
  });

  // console.log("Habits streak==>", JSON.stringify(streak.data, null, 2));

  return (
    <Pressable onPress={() => console.log("button is clicked")}>
      <LinearGradient
        colors={["#4A4A4A", "#1E1E1E"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // alignItems: "stretch",
            // alignItems: "center",
          }}
        >
          <LinearGradient
            colors={["#8A2BE2", "#34127E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            //   style={styles.card}
            style={{
              width: horizontalScale(50),
              height: horizontalScale(50),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: horizontalScale(8),
            }}
          >
            {categoryDetails?.icon}
          </LinearGradient>
          <BouncyCheckbox
            size={horizontalScale(25)}
            isChecked={habit_progress?.[0]?.status || false}
            fillColor="rgba(138, 43, 226, 1)"
            unFillColor="transparent"
            iconStyle={{ borderColor: "red" }}
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-end",
              flexDirection: "column",
            }}
            innerIconStyle={{ borderWidth: 2 }}
            // textStyle={{ fontFamily: "JosefinSans-Regular" }}
            onPress={(isChecked: boolean) => {
              mutation.mutateAsync();
            }}
          />
        </View>
        <ThemedText
          numberOfLines={2}
          adjustsFontSizeToFit
          style={{ fontFamily: "PoppinsSemiBold", marginTop: verticalScale(6) }}
        >
          {habit_name}
        </ThemedText>
        <ThemedText
          style={{ marginTop: verticalScale(4), fontSize: getFontSize(14) }}
        >
          🔥 {streakDetails?.data || 0} Days
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: horizontalScale(16),
    borderRadius: horizontalScale(10),
    marginVertical: verticalScale(8),
    width: _cardWidth,
    // aspectRatio: 1,
  },
});

export default HabitCard;
