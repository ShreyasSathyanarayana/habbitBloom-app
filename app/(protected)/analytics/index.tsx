import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const AnalyticsScreen = () => {
  return (
    <Container>
      <Header
        title="Analytics"
        rightIcon={
          <TouchableOpacity>
            <ThemedText style={{ fontSize: getFontSize(14) }}>Edit</ThemedText>
          </TouchableOpacity>
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default AnalyticsScreen;
