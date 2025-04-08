import { horizontalScale } from "@/metric";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  imageUri: string | null;
  imageType: "Option" | "View";
  selected?: boolean;
};

const blurhash = "L-MZj?s..TNI%Lj[t7aeTKa}%1oJ";
const AvatarImage = ({ imageType, imageUri, selected = false }: Props) => {
  return (
    <View
      style={[
        styles.container,
        imageType === "Option" && styles.optionContainer,
        selected && { borderColor: "rgba(138, 43, 226, 1)" },
      ]}
    >
      <Image
        source={imageUri}
        style={{ flex: 1 }}
        placeholder={{ blurhash }}
        transition={500}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(120),
    borderWidth: horizontalScale(4),
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
});

export default AvatarImage;
