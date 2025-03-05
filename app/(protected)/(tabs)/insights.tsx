import ScrollableContainer from "@/components/ui/scrollable-container";
import { ThemedText } from "@/components/ui/theme-text";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Insights = () => {
  return (
    <ScrollableContainer>
       {[...Array(20).keys()].map((item) => (
                <View
                  key={item}
                  style={{
                    height: 100,
                    backgroundColor: "#222",
                    marginBottom: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Item {item}
                  </Text>
                </View>
              ))}
    </ScrollableContainer>
  );
};

const styles = StyleSheet.create({});

export default Insights;
