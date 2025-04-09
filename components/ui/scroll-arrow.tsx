// components/ScrollArrow.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import NextArrowIcon from "@/assets/svg/next-arrow.svg";
import PreviousArrowIcon from "@/assets/svg/previous-arrow.svg";

type ScrollArrowProps = {
  direction: "left" | "right";
  flatListRef: React.RefObject<any>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  itemWidth: number;
  dataLength: number;
};

const ScrollArrow = ({
  direction,
  flatListRef,
  currentIndex,
  setCurrentIndex,
  itemWidth,
  dataLength,
}: ScrollArrowProps) => {
  const isLeft = direction === "left";

  const handleScroll = () => {
    let newIndex = isLeft ? currentIndex - 1 : currentIndex + 1;

    // Clamp index between 0 and dataLength - 1
    newIndex = Math.max(0, Math.min(newIndex, dataLength - 1));

    flatListRef.current?.scrollToOffset({
      offset: newIndex * itemWidth,
      animated: true,
    });

    setCurrentIndex(newIndex);
  };

  return (
    <TouchableOpacity onPress={handleScroll} style={styles.arrowButton}>
      {/* <Text style={styles.arrow}>{isLeft ? "←" : "→"}</Text> */}
      {isLeft ? <PreviousArrowIcon /> : <NextArrowIcon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowButton: {
    padding: 10,
    // backgroundColor: "#ddd",
    borderRadius: 25,
    marginHorizontal: 4,
  },
  arrow: {
    fontSize: 20,
  },
});

export default ScrollArrow;
