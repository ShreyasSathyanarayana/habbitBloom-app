import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import ActionSheetContainer from "@/components/ui/action-sheet-container";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import ViewProfileIcon from "@/assets/svg/view-profile-icon.svg";
import ReportIcon from "@/assets/svg/report-icon.svg";
import HideCommentIcon from "@/assets/svg/hide-comment-icon.svg";
import CommentIcon from "@/assets/svg/comment-icon copy.svg";
import ReportRightArrow from "@/assets/svg/report-right-arrow.svg";
import DeletePostIcon from "@/assets/svg/delete-post-icon.svg";
import EditPostIcon from "@/assets/svg/edit-post-icon.svg";
import { getUserId } from "@/utils/persist-storage";
import { reportList } from "@/utils/constants";
import { router } from "expo-router";

const _iconSize = horizontalScale(20);

const MoreOptionSheet = (props: SheetProps<"post-more-option">) => {
  const payload = props?.payload?.postDetails;
  const userId = getUserId();
  const isMyPost = payload?.user_id == userId;
  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      {!isMyPost && <OtherUserView />}
      {isMyPost && <CurrentUseView />}
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default MoreOptionSheet;

const OtherUserView = () => {
  const [reportScreenOpen, setReportScreenOpen] = useState(false);

  const handleReportItem = (reportName: string) => {
    setReportScreenOpen(false);
    SheetManager.hide("post-more-option");
    router.push("/(protected)/create-post/report-completed-screen");
  };
  return (
    <View style={{ gap: verticalScale(24) }}>
      {!reportScreenOpen && (
        <>
          <ActionSheetButton
            leftIcon={<ViewProfileIcon width={_iconSize} height={_iconSize} />}
            buttonName={"View Profile"}
          />
          <ActionSheetButton
            leftIcon={<ReportIcon width={_iconSize} height={_iconSize} />}
            buttonName={"Report Post"}
            labelStyle={{ color: "rgba(255, 59, 48, 1)" }}
            onPress={() => setReportScreenOpen(true)}
          />
        </>
      )}
      {reportScreenOpen && (
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={reportList}
          ListHeaderComponent={() => (
            <ThemedText
              style={{
                textAlign: "center",
                fontFamily: "PoppinsSemiBold",
                marginBottom: verticalScale(20),
              }}
            >
              Report
            </ThemedText>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          renderItem={({ item }) => (
            <ReportItem name={item} onPress={() => handleReportItem(item)} />
          )}
        />
      )}
    </View>
  );
};

const CurrentUseView = () => {
  return (
    <View style={{ gap: verticalScale(24) }}>
      <ActionSheetButton
        leftIcon={<HideCommentIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Turn off comments"}
      />
      <ActionSheetButton
        leftIcon={<EditPostIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Edit post"}
      />
      <ActionSheetButton
        leftIcon={<DeletePostIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Delete post"}
        labelStyle={{ color: "rgba(255, 59, 48, 1)" }}
        onPress={() => SheetManager.show("delete-post")}
      />
    </View>
  );
};

const ReportItem = ({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.reportContainer}>
      <ThemedText>{name}</ThemedText>
      <ReportRightArrow width={_iconSize} height={_iconSize} />
    </TouchableOpacity>
  );
};
