import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import { getFontSize } from "@/font";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import SupportAndFeedBackIcon from "@/assets/svg/support-feedback-icon.svg";
import { horizontalScale } from "@/metric";
import {
  getReadSuggestion,
  getUserRole,
  setNumberReadSuggestion,
} from "@/utils/persist-storage";
import { useQuery } from "@tanstack/react-query";
import { getSuggestionCount } from "@/api/api";
import { Badge } from "@rneui/base";
const _iconSize = horizontalScale(24);
const SupportFeedback = () => {
  const role = getUserRole();
  const numberReadSuggestion = getReadSuggestion();
  const getSuggestionCountQuery = useQuery({
    queryKey: ["getSuggestionCount"],
    queryFn: () => {
      return getSuggestionCount();
    },
    enabled: role === "admin",
  });
  const currentUnreadSuggestionCount =
    (getSuggestionCountQuery.data ?? 0) - numberReadSuggestion;
  console.log(getSuggestionCountQuery.data);

  return (
    <ActionSheetButton
      onPress={() => {
        getSuggestionCountQuery?.data &&
          setNumberReadSuggestion(getSuggestionCountQuery?.data);

        SheetManager.show("support-and-feedback");
      }}
      leftIcon={
        role !== "admin" ? (
          <SupportAndFeedBackIcon width={_iconSize} height={_iconSize} />
        ) : (
          <Badge
            value={(getSuggestionCountQuery.data ?? 0) - numberReadSuggestion}
            status={currentUnreadSuggestionCount > 0 ? "error" : "success"}
          />
        )
      }
      buttonName={"Support & Feedback"}
      labelStyle={styles.textStyle}
    />
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
  },
});

export default SupportFeedback;
