import { getHabitById } from "@/api/api";
import Label from "@/components/ui/Label";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  habitId: string;
};

const HabitDescription = ({ habitId }: Props) => {
  const getHabitDetailsQuery = useQuery({
    queryKey: ["habitDetails", habitId],
    queryFn: () => {
      return getHabitById(habitId);
    },
    enabled: !!habitId,
  });
//   console.log(
//     "getHabitDetailsQuery",
//     JSON.stringify(getHabitDetailsQuery?.data, null, 2)
//   );

  return (
    <View>
      <Label label="Description">
        <Skeleton show={getHabitDetailsQuery?.isLoading}>
          <View
            style={[
              styles.descriptionContainer,
              !getHabitDetailsQuery?.data?.habit_description && {
                borderColor: "rgba(60, 60, 67, 0.6)",
              },
            ]}
          >
            <ThemedText
              style={[
                { fontSize: getFontSize(14) },
                !getHabitDetailsQuery?.data?.habit_description && {
                  color: "rgba(81, 85, 98, 1)",
                },
              ]}
            >
              {getHabitDetailsQuery?.data?.habit_description ??
                "No description"}
            </ThemedText>
          </View>
        </Skeleton>
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionContainer: {
    minHeight: verticalScale(200),
    backgroundColor: "rgba(31, 34, 42, 1)",
    borderRadius: horizontalScale(12),
    borderWidth: horizontalScale(2),
    borderColor: "white",
    padding: horizontalScale(16),
  },
});

export default HabitDescription;
