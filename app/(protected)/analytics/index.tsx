import AnalyticsBar from "@/components/module/analytics-screen/analytics-bar";
import AnalyticsDetails from "@/components/module/analytics-screen/analytics-details";
import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
const menu = ["Weekly", "Monthly", "Year"];
const AnalyticsScreen = () => {
  const [selectedMenu, setSelectedMenu] = React.useState(menu[0]);
  const route = useRoute<{
    key: string;
    name: string;
    params: { id: string };
  }>();
  const { id: habitId } = route.params;
  const onPressMenu = (item: string, index: number) => {
    setSelectedMenu(item);
  };
  return (
    <Container>
      <Header
        title="Analytics"
        rightIcon={
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(protected)/create-habit",
                params: { id: habitId },
              })
            }
          >
            <ThemedText style={{ fontSize: getFontSize(14) }}>Edit</ThemedText>
          </TouchableOpacity>
        }
      />
      <View
        style={{
          paddingHorizontal: horizontalScale(16),
          paddingTop: verticalScale(10),
        }}
      >
        <AnalyticsBar onChageMenu={onPressMenu} />
        <AnalyticsDetails selectedOption={selectedMenu} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default AnalyticsScreen;
