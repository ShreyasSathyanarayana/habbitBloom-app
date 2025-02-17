import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
} from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEventData,
} from "react-native-pager-view";
import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { getFontSize } from "@/font";
import CircleArrow from "@/assets/svg/circle-arrow.svg";
import Animated, {
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Onboarding Screens Data
const OnboardingDetails = [
  {
    image: require("@/assets/gifs/onboarding1.gif"),
    title: "Welcome to HabitBloom!",
    description:
      "Your AI-powered habit tracker. Build habits, stay motivated, and achieve goals.",
  },
  {
    image: require("@/assets/gifs/onboarding2.gif"),
    title: "Never Miss a Habit!",
    description:
      "HabitBloom’s AI sends you smart reminders at the best times to keep you on track.",
  },
  {
    image: require("@/assets/gifs/onboarding3.gif"),
    title: "Track Your Growth!",
    description:
      "Easily visualize your progress with streaks, analytics, and AI-powered insights.",
  },
];

const pageWidth = width - horizontalScale(16 * 2);
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
const ActiveDotWidth = horizontalScale(20);
const InActiveDotWidth = horizontalScale(10);

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentPage < OnboardingDetails.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
      setCurrentPage(currentPage + 1);
    }
    else{
      // add the next page here
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({
      index: OnboardingDetails.length - 1,
      animated: true,
    });
    setCurrentPage(OnboardingDetails.length - 1);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    setCurrentPage(pageIndex);
  };

  const onScroll = (e: any) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof OnboardingDetails)[0];
    index: number;
  }) => (
    <View style={[styles.page, { width: pageWidth }]}>
      {currentPage === index && (
        <Image
          //  key={
          //    currentPage === index ? `gif-${index}-${Date.now()}` : `gif-${index}`
          //  }
          source={item.image}
          style={styles.image}
        />
      )}
      {currentPage !== index && <View style={styles.image} />}
      <ThemedText style={styles.title}>{item.title}</ThemedText>
      <ThemedText style={styles.description}>{item.description}</ThemedText>
    </View>
  );

  return (
    <Container style={{ paddingHorizontal: horizontalScale(15) }}>
      {/* Skip Button */}
      <View style={styles.section1}>
        {currentPage !== OnboardingDetails?.length - 1 && (
          <AnimatedBtn
            entering={FadeInUp.springify().damping(40).stiffness(200)}
            exiting={FadeOutUp.springify().damping(40).stiffness(200)}
            style={styles.skipContainer}
            onPress={handleSkip}
          >
            <ThemedText style={styles.skipText}>Skip</ThemedText>
            <CircleArrow
              width={horizontalScale(20)}
              height={verticalScale(20)}
            />
          </AnimatedBtn>
        )}
      </View>

      {/* PagerView for Onboarding Screens */}
      <View style={styles.section2}>
        {/* <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={handlePageChange}
          overdrag={false}
        >
          {OnboardingDetails.map((item, index) => (
            <View key={index} style={styles.page}>
              <Image source={item.image} style={styles.image} />
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              <ThemedText style={styles.description}>
                {item.description}
              </ThemedText>
            </View>
          ))}
        </PagerView> */}
        <FlatList
          ref={flatListRef}
          data={OnboardingDetails}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={renderItem}
          onScroll={onScroll}
        />
      </View>

      {/* Pagination Indicator */}
      <View style={styles.paginationContainer}>
        {OnboardingDetails.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const widthInterpolate = interpolate(
              scrollX.value / width,
              [index - 1, index, index + 1],
              [InActiveDotWidth, ActiveDotWidth, InActiveDotWidth], // Active dot is wider
              "clamp"
            );

            // const opacityInterpolate = interpolate(
            //   scrollX.value / width,
            //   [index - 1, index, index + 1],
            //   [0.5, 1, 0.5], // Active dot is more visible
            //   "clamp"
            // );

            const backgroundColorInterpolate = interpolateColor(
              scrollX.value / width,
              [index - 1, index, index + 1],
              ["#FFFFFF", "#8A2BE2", "#FFFFFF"]
            );

            return {
              width: widthInterpolate,
              // opacity: opacityInterpolate,
              backgroundColor: backgroundColorInterpolate,
            };
          });

          return (
            <Animated.View
              key={index}
              style={[styles.paginationDot, animatedDotStyle]}
            />
          );
        })}
      </View>

      {/* Next Button */}
      <View style={styles.section3}>
        <GradientButton
          title={
            currentPage !== OnboardingDetails?.length - 1
              ? "NEXT"
              : "GET STARTED"
          }
          onPress={handleNext}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  section1: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  skipContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  skipText: {
    fontFamily: "Poppins_500Medium",
    fontSize: getFontSize(16),
  },
  section2: {
    flex: 4,
  },
  pager: {
    width: "100%",
    height: "100%",
  },
  page: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "60%",
    resizeMode: "contain",
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: getFontSize(24),
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    color: "white",
    marginBottom: verticalScale(16),
  },
  description: {
    fontSize: getFontSize(14),
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },
  paginationDot: {
    width: horizontalScale(10),
    height: horizontalScale(10),
    borderRadius: 10,
    backgroundColor: "red",
    marginHorizontal: horizontalScale(5),
  },
  activeDot: {
    backgroundColor: "#FF1493",
    width: horizontalScale(18),
    height: horizontalScale(10),
  },
  section3: {
    flex: 1,
  },
});

export default Onboarding;
