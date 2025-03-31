import React from "react";
import { StyleSheet, View } from "react-native";
import ServerErrorIcon from "@/assets/svg/server-error.svg";
import { ThemedText } from "@/components/ui/theme-text";

import { horizontalScale, verticalScale } from "@/metric";
import Button from "@/components/ui/button";
type Props = {
  onRefresh: () => void;
};
const _iconSize = 300;

const ServerError = ({ onRefresh }: Props) => {
  return (
    <View style={styles.container}>
      <ServerErrorIcon width={_iconSize} height={_iconSize} />
      <ThemedText style={{ fontFamily: "PoppinsMedium", textAlign: "center" }}>
        Oops! Our servers are currently down. Please try again later.
      </ThemedText>
      <Button
        label="RETRY"
        onPress={onRefresh}
        labelStyle={{ fontFamily: "PoppinsBold" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    gap: verticalScale(20),
  },
});

export default ServerError;
