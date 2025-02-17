import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ContainerProps = {
  children?: React.ReactNode;
} & ViewProps;

const Container = ({ children, style, ...rest }: ContainerProps) => {
  return (
    <SafeAreaView {...rest} style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default Container;
