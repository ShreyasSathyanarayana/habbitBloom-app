import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Avatar from "../streaks/ui/avatar";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import { getFontSize } from "@/font";
import moment from "moment";
import ThreeDots from "@/assets/svg/three-dots copy.svg";
type Props = {
  uri: string | null;
  userName: string | null;
  created_at: string;
  onClickThreeDot: () => void;
};

const _iconSize = horizontalScale(24);

const PostHeader = ({ uri, userName, created_at, onClickThreeDot }: Props) => {
  const timeAgo = moment.utc(created_at).local().fromNow();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar uri={uri ?? ""} />
        <View>
          <ThemedText
            style={{ fontSize: getFontSize(14), fontFamily: "PoppinsSemiBold" }}
          >
            {userName}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: getFontSize(12),
              color: "rgba(217, 217, 217, 0.8)",
            }}
          >
            {timeAgo}
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity onPress={onClickThreeDot}>
        <ThreeDots width={_iconSize} height={_iconSize} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: horizontalScale(10),
    alignItems: "center",
  },
});

export default PostHeader;
