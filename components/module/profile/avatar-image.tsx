import { horizontalScale } from "@/metric";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import PremiumProfileIcon from "@/assets/svg/premium-profile-icon.svg";

type Props = {
  imageUri: string | null;
  imageType: "Option" | "View";
  selected?: boolean;
  isSubscribed?: boolean;
};

const blurhash = "L-MZj?s..TNI%Lj[t7aeTKa}%1oJ";
const AvatarImage = ({
  imageType,
  imageUri,
  selected = false,
  isSubscribed = false,
}: Props) => {
  const _premiumIconSize =
    imageType === "View" ? horizontalScale(38) : horizontalScale(22);
  return (
    <View>
      {isSubscribed && imageType == "View" && (
        <PremiumProfileIcon
          style={[
            styles.premiumIconStyle,
            imageType == "View" && { left: 0, top: horizontalScale(-10) },
          ]}
          width={_premiumIconSize}
          height={_premiumIconSize}
        />
      )}
      <View
        style={[
          styles.container,
          imageType === "Option" && styles.optionContainer,
          selected && { borderColor: "rgba(138, 43, 226, 1)" },
          isSubscribed && !selected && { borderColor: "rgba(242, 193, 0, 1)" },
        ]}
      >
        <Image
          source={imageUri}
          style={{ flex: 1 }}
          placeholder={{ blurhash }}
          // transition={1000}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(120),
    borderWidth: horizontalScale(7),
    backgroundColor: "rgba(217, 217, 217, 1)",
    borderColor: "black",
    elevation: 2,
    overflow: "hidden",
  },
  optionContainer: {
    width: horizontalScale(80),
    height: horizontalScale(80),
    borderRadius: horizontalScale(80),
    borderWidth: horizontalScale(4),
    backgroundColor: "rgba(217, 217, 217, 1)",
    borderColor: "black",
  },
  premiumIconStyle: {
    position: "absolute",
    top: horizontalScale(-4),
    left: horizontalScale(1),
    // zIndex: 2,
  },
});

export default AvatarImage;
