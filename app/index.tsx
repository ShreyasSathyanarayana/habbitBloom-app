import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { Button, Text, View } from "react-native";
import HomeScreen from "./home";
import React from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter()
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello world</Text>
      <Button onPress={()=>router.push('/home')} title="Next"></Button>
    </View>
  );
}
