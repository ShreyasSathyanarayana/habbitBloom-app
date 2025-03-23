import AnalyticsBar from "@/components/module/analytics-screen-old/analytics-bar";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { StyleSheet, View } from "react-native";

const Analytics = () => {
  const { id, category } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = React.useState("Calendar");
  //   console.log("id", id, category);
  const menu = ["Calendar", "Statistics"];

  return (
    <Container>
      <Header title="Analytics" />
      <View style={{ paddingHorizontal: horizontalScale(16) }}>
        <AnalyticsBar
          menu={menu}
          onChangeMenu={(item, index) => setSelectedOption(item)}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Analytics;
