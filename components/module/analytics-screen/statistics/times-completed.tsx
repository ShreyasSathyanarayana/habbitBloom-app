import LinerGradientContainer from "@/components/ui/liner-gradient-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import TimesCompletedHeader from "./times-completed-header";
import TimesCompletedDetails from "./times-completed-details";
import { verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { getCompletedHabitStats } from "@/api/api";
import { Skeleton } from "moti/skeleton";
type Props = {
  habitId: string;
};

const TimesCompleted = ({ habitId }: Props) => {
  const getCompletedDetailsQuery = useQuery({
    queryKey: ["completed-details", habitId],
    queryFn: () => {
      return getCompletedHabitStats(habitId);
    },
    enabled: !!habitId,
  });
  return (
    <Skeleton show={getCompletedDetailsQuery.isLoading}>
      <LinerGradientContainer style={{ gap: verticalScale(16) }}>
        <TimesCompletedHeader />
        <TimesCompletedDetails
          habitId={habitId}
          getCompletedDetailsQuery={getCompletedDetailsQuery}
        />
      </LinerGradientContainer>
    </Skeleton>
  );
};

const styles = StyleSheet.create({});

export default TimesCompleted;
