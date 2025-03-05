import Container from "@/components/ui/container";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import SkipIcon from "@/assets/svg/skip-icon.svg";
import { getFontSize } from "@/font";
import { GradientButton } from "@/components/ui/gradient-button";
import ReadingIcon from "@/assets/svg/reading-icon.svg";
import MeditationIcon from "@/assets/svg/meditation-icon.svg";
import ExerciseIcon from "@/assets/svg/exercise-icon.svg";
import HydarationIcon from "@/assets/svg/hydration-icon.svg";
import SleepIcon from "@/assets/svg/sleep-icon.svg";
import JournalingIcon from "@/assets/svg/journaling.svg";
import PersonalizeButton from "@/components/ui/personalize-button";
import Animated from "react-native-reanimated";

const goodHabits = [
  {
    id: 1,
    title: "Reading",
    icon: <ReadingIcon />,
  },
  {
    id: 2,
    title: "Mediation",
    icon: <MeditationIcon />,
  },
  {
    id: 3,
    title: "Exercise",
    icon: <ExerciseIcon />,
  },
  {
    id: 4,
    title: "Hydration",
    icon: <HydarationIcon />,
  },
  {
    id: 5,
    title: "Sleep Schedule",
    icon: <SleepIcon />,
  },
  {
    id: 6,
    title: "Journaling",
    icon: <JournalingIcon />,
  },
];

const badHabits = [{ id: 1, title: "Reduce Screen Time" }];

// const AnimatedText = Animated.createAnimatedComponent(ThemedText);

const Personalization = () => {
  const [selectedGoodHabits, setSelectedGoodHabits] = useState<number[]>([]);
  const pages = [1, 1];

  const handleSelectHabit = (habitId: number) => {
    setSelectedGoodHabits((prevSelected) =>
      prevSelected.includes(habitId)
        ? prevSelected.filter((id) => id !== habitId) // Deselect if already selected
        : prevSelected.length < 3
        ? [...prevSelected, habitId] // Add if less than 3 selected
        : prevSelected
    );
  };
  return (
    <Container style={{ paddingHorizontal: horizontalScale(16) }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(6),
          }}
        >
          <ThemedText>Skip</ThemedText>
          <SkipIcon width={horizontalScale(16)} height={verticalScale(16)} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Animated.Text
          style={{
            fontFamily: "PoppinsBold",
            fontSize: getFontSize(18),
            marginBottom: verticalScale(6),
            color: "rgba(255, 255, 255, 1)",
          }}
        >
          Let's personalize your experience!
        </Animated.Text>
        <Animated.Text
          style={{
            color: "rgba(209, 209, 209, 1)",
            fontFamily: "PoppinsRegular",
            fontSize: getFontSize(16),
          }}
        >
          Choose 3 good habits to follow and build a better routine.
        </Animated.Text>
        <FlatList
          data={goodHabits}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            gap: verticalScale(16),
            marginTop: verticalScale(16),
          }}
          style={{
            paddingBottom: verticalScale(50),
          }}
          renderItem={({ item, index }) => {
            const isSelected = selectedGoodHabits.includes(item.id);
            return (
              <PersonalizeButton
                item={item}
                disable={selectedGoodHabits.length >= 3 && !isSelected}
                selected={isSelected}
                onPress={() => handleSelectHabit(item.id)}
                style={[
                  index === goodHabits.length - 1 && {
                    marginBottom: verticalScale(16),
                  },
                ]}
                key={index + "personalize"}
              />
            );
          }}
        />
      </View>
      <View style={styles.footer}>
        <GradientButton
          title="CONTINUE"
          disable={selectedGoodHabits.length < 3}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 0.2,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  container: {
    flex: 2,
    // paddingBottom: 23,
    // backgroundColor: "yellow",
  },
  footer: {
    flex: 0.3,
    // elevation: 1,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "center",
    // backgroundColor: "green",
  },
});

export default Personalization;
