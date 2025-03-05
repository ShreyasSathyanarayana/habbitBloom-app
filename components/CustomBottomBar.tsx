import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TABS = [
  { name: "Home", icon: "home" },
  { name: "Profile", icon: "user" },
  { name: "Settings", icon: "cog" },
];

const CustomBottomBar = ({ state, navigation }: BottomTabBarProps) => {
  console.log(JSON.stringify(state, null, 2));

  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isActive = state.index === index;

        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => navigation.navigate(state.routes[index].name)}
          >
            <FontAwesome5
              name={tab.icon}
              size={24}
              color={isActive ? "#fff" : "#888"}
            />
            <Text style={[styles.text, { color: isActive ? "#fff" : "#888" }]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  text: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomBottomBar;
