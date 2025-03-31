import React from "react";
import { StyleSheet, View } from "react-native";
import NoInternetIcon from "@/assets/svg/no-internet.svg";
import { horizontalScale, verticalScale } from "@/metric";
import { ThemedText } from "@/components/ui/theme-text";
import Button from "@/components/ui/button";
const _iconSize = horizontalScale(300);
type Props = {
  onRefresh: () => void;
};

const NoInternet = ({ onRefresh }: Props) => {
  return (
    <View style={styles.container}>
      <NoInternetIcon width={_iconSize} height={_iconSize} />
      <ThemedText style={{ fontFamily: "PoppinsMedium", textAlign: "center" }}>
        No Internet Connection. Please check your network and try again.
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
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(16),
  },
});

export default NoInternet;
