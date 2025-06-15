import React from "react";
import { Dimensions, StyleSheet, TouchableHighlight, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { horizontalScale, verticalScale } from "@/metric";
import { Image } from "expo-image";
import { blurhash } from "../profile/avatar-image";
import { useImage } from "@/context/ImageContext";

const { width: screenWidth } = Dimensions.get("window");
const _imageWidth = screenWidth - horizontalScale(32);

type Props = {
  images: string[];
  rewardPost: boolean;
};

const PostImages = ({ images, rewardPost }: Props) => {
  if (!images || images.length === 0) return null;
  const { showImage } = useImage();

  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => showImage(item)}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              contentFit={rewardPost ? "contain" : "cover"}
              // resizeMode="cover"
              placeholder={{ blurhash }}
            />
          </TouchableHighlight>
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* Dots Indicator */}
      {images?.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const inputRange = [
                (index - 1) * _imageWidth,
                index * _imageWidth,
                (index + 1) * _imageWidth,
              ];

              const width = interpolate(
                scrollX.value,
                inputRange,
                [8, 16, 8],
                "clamp"
              );

              const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                "clamp"
              );

              return {
                width,
                opacity,
              };
            });

            return (
              <Animated.View
                key={index}
                style={[styles.dot, animatedDotStyle]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(8),
  },
  image: {
    width: _imageWidth,
    // height: undefined,
    aspectRatio: 16 / 16,
    // marginRight: horizontalScale(10),
    borderRadius: horizontalScale(8),
    backgroundColor: "transparent",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(10),
    gap: horizontalScale(6),
    // position: "absolute",
    bottom: verticalScale(10),
    top: verticalScale(-40),
    position: "relative",
  },
  dot: {
    height: horizontalScale(8),
    borderRadius: horizontalScale(4),
    backgroundColor: "rgba(217, 217, 217, 1)",
  },
});

export default PostImages;
