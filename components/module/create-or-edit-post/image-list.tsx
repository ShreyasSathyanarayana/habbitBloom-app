import { horizontalScale, verticalScale } from "@/metric";
import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { blurhash } from "../profile/avatar-image";
import RemoveImageIcon from "@/assets/svg/close-preview-image.svg";
import Animated, {
  JumpingTransition,
  LinearTransition,
} from "react-native-reanimated";

const _imageSize = horizontalScale(200);
const _spacing = horizontalScale(16);
const _iconSize = horizontalScale(18);

type ImageListProps = {
  images: string[];
  onRemoveImage: (index: number) => void;
  editMode: boolean;
  rewardMode: boolean;
};

const ImageList = ({
  images,
  onRemoveImage,
  editMode,
  rewardMode,
}: ImageListProps) => {
  if (!images || images.length === 0) {
    return null; // Return null if there are no images to display
  }
  return (
    <View>
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        key={"image-list"}
        itemLayoutAnimation={LinearTransition}
        data={images}
        horizontal
        // scrollEnabled
        // decelerationRate="fast"
        // snapToInterval={_imageSize + _spacing}
        // pagingEnabled
        scrollEventThrottle={16}
        contentContainerStyle={{ marginTop: verticalScale(16) }}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View style={{ width: _spacing }} />}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.container,
              rewardMode && {
                borderWidth: horizontalScale(1),
                borderColor: "white",
                paddingVertical: horizontalScale(10),
              },
            ]}
          >
            {!editMode && (
              <TouchableOpacity
                hitSlop={10}
                onPress={() => onRemoveImage(index)}
                style={styles.removeIcon}
              >
                <RemoveImageIcon width={_iconSize} height={_iconSize} />
              </TouchableOpacity>
            )}
            <Image
              style={styles.image}
              source={item}
              placeholder={{ blurhash }}
              contentFit={rewardMode ? "contain" : "cover"}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: _imageSize,
    height: _imageSize,
    borderRadius: horizontalScale(8),
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
  removeIcon: {
    position: "absolute",
    top: horizontalScale(8),
    right: horizontalScale(8),
    zIndex: 1,
    padding: horizontalScale(8),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: horizontalScale(20),
  },
});

export default ImageList;
