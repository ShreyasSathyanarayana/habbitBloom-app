import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { horizontalScale, verticalScale } from "@/metric";
import { Image } from "expo-image";
import { blurhash } from "../profile/avatar-image";

const { width: screenWidth } = Dimensions.get("window");
const _imageWidth = screenWidth - horizontalScale(32);

type Props = {
  images: string[];
};

const PostImages = ({ images }: Props) => {
  if (!images || images.length === 0) return null;

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
          <Image
            source={{ uri: item }}
            style={styles.image}
            contentFit="cover"
            // resizeMode="cover"
            placeholder={{ blurhash }}
          />
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
    height: verticalScale(258),
    // marginRight: horizontalScale(10),
    borderRadius: horizontalScale(8),
    backgroundColor: "#eee",
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
