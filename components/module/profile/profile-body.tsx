import { horizontalScale, verticalScale } from "@/metric";
import React from "react";
import { StyleSheet, View } from "react-native";
import KeyIcon from "@/assets/svg/key-icon.svg";
import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import ChangePhoneNumberIcon from "@/assets/svg/phone-icon.svg";
import SuggestionIcon from "@/assets/svg/suggestion-icon.svg";
import AboutUsIcon from "@/assets/svg/aboutus-icon.svg";
import ShareIcon from "@/assets/svg/share-icon.svg";
import RateAppIcon from "@/assets/svg/rate-icon.svg";
import SubscriptionIcon from "@/assets/svg/subscription-icon.svg";
import LogoutIcon from "@/assets/svg/logout-icon.svg";
import { getFontSize } from "@/font";
import { useAuth } from "@/context/AuthProvider";
const _iconSize = horizontalScale(24);

const ProfileBody = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <ActionSheetButton
        leftIcon={<KeyIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Change Password"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        leftIcon={
          <ChangePhoneNumberIcon width={_iconSize} height={_iconSize} />
        }
        buttonName={"Update Phone number"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        leftIcon={<SuggestionIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Suggestion Box"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        leftIcon={<AboutUsIcon width={_iconSize} height={_iconSize} />}
        buttonName={"About Us"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        leftIcon={<ShareIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Share Our App"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        leftIcon={<RateAppIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Rate Us"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        leftIcon={<SubscriptionIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Manage Subscription"}
        labelStyle={styles.textStyle}
      />
      <ActionSheetButton
        onPress={() => logout()}
        leftIcon={<LogoutIcon width={_iconSize} height={_iconSize} />}
        buttonName={"Log out"}
        labelStyle={styles.logoutStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: horizontalScale(16),
    gap: verticalScale(20),
  },
  textStyle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
  },
  logoutStyle: {
    fontSize: getFontSize(14),
    fontFamily: "PoppinsMedium",
    color: "rgba(255, 59, 48, 1)",
  },
});

export default ProfileBody;
