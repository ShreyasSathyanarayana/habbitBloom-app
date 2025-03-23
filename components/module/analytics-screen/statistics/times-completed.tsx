import LinerGradientContainer from "@/components/ui/liner-gradient-container";
import React from "react";
import { StyleSheet, View } from "react-native";
import TimesCompletedHeader from "./times-completed-header";
import TimesCompletedDetails from "./times-completed-details";
import { verticalScale } from "@/metric";
type Props = {
  habitId: string;
};

const TimesCompleted = ({ habitId }: Props) => {
  return (
    <LinerGradientContainer style={{ gap: verticalScale(16) }}>
      <TimesCompletedHeader />
      <TimesCompletedDetails habitId={habitId} />
    </LinerGradientContainer>
  );
};

const styles = StyleSheet.create({});

export default TimesCompleted;
