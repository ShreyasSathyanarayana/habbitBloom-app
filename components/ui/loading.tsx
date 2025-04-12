import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={"large"} color={"white"} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Loading;
