import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import StreakChallengeIcon from "@/assets/svg/streak-awards-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
type Props = {
  habitId: string;
};

const StreakChallenge = ({ habitId }: Props) => {
  const sampleAward = [1, 2, 3, 4, 5, 6];
  return (
    <View style={{ gap: verticalScale(16) }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <StreakChallengeIcon />
        <ThemedText style={{ fontSize: getFontSize(12) }}>
          Streak Challenge
        </ThemedText>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: horizontalScale(16),
        }}
        data={sampleAward}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return <View style={styles.awardContainer} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  awardContainer: {
    width: horizontalScale(60),
    height: horizontalScale(60),
    borderRadius: horizontalScale(8),
    backgroundColor: "white",
  },
});

export default StreakChallenge;
