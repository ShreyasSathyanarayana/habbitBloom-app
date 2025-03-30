import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
const data = [
  {
    title: "No Backdating",
    description:
      "Mark habits only today or in the future for authentic tracking.",
  },
  {
    title: "Set Your Schedule",
    description:
      "The app lets you track only on selected days to keep you accountable.",
  },
  {
    title: "Stay Consistent",
    description: "Log daily to maintain streaks and earn achievement badges.",
  },
  {
    title: "Use Reminders",
    description:
      "Enable notifications & sync with Google Calendar for timely prompts.",
  },
  {
    title: "Share Your Wins",
    description: "Celebrate progress by sharing your badges with friends!",
  },
];

const HabitInstruction = () => {
  const TextInfo = ({ item }: { item: any }): React.ReactNode => {
    return (
      <View style={styles.row}>
        <View style={styles.dot} />
        <ThemedText style={styles.descriptionStyle}>
          <ThemedText style={styles.title}>{item.title}</ThemedText> :{" "}
          {item.description}
        </ThemedText>
      </View>
    );
  };
  return (
    <Container>
      <Header title="Instructions" />
      <View style={styles.container}>
        <View>
          <ThemedText
            style={[
              styles.textStyle,
              {
                color: "rgba(175, 180, 225, 1)",
              },
            ]}
          >
            Effective Habit Tracking
          </ThemedText>
          {/* <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: verticalScale(16) }}
          contentContainerStyle={{ gap: verticalScale(16) }}
          keyExtractor={(_, index) => index.toString() + "instructionkey"}
          renderItem={renderItem}
        /> */}
          <View
            style={{
              gap: verticalScale(16),
              marginVertical: verticalScale(16),
            }}
          >
            {data.map((item, index) => (
              <TextInfo key={index} item={item} />
            ))}
          </View>

          <ThemedText style={styles.descriptionStyle}>
            💡{" "}
            <ThemedText
              style={[
                styles.descriptionStyle,
                { color: "rgba(175, 225, 1, 1)" },
              ]}
            >
              Tip
            </ThemedText>{" "}
            {""}: Progress comes from consistency, not perfection. Stay on track
            and celebrate small wins! 🚀
          </ThemedText>
        </View>
        <GradientButton title="Go back" onPress={() => router.back()} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: horizontalScale(16),
    justifyContent: "space-between",
  },
  textStyle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: getFontSize(14),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: horizontalScale(8),
  },
  dot: {
    width: horizontalScale(6),
    height: horizontalScale(6),
    borderRadius: horizontalScale(8),
    backgroundColor: "rgba(138, 43, 226, 1)",
    marginTop: horizontalScale(8),
  },
  title: {
    fontSize: getFontSize(14),
    color: "rgba(138, 43, 226, 1)",
  },
  descriptionStyle: {
    fontSize: getFontSize(14),
  },
});

export default HabitInstruction;
