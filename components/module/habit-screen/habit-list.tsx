import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HabitCard, { HabitProp } from "./habit-card";
import { verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import { getAllHabits } from "@/api/api";
import Animated, {
  LayoutAnimationConfig,
  LinearTransition,
  SharedValue,
} from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";

type Props = {
  scrollY: SharedValue<number>;
  habitList?: HabitProp[];
  isLoading: boolean;
};

const HabitList = ({ scrollY, isLoading, habitList }: Props) => {
  // console.log("habit list", JSON.stringify(gethabitQuery.data, null, 2));
  if (isLoading) {
    return (
      <View style={styles.container}>
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ gap: verticalScale(16) }}
          renderItem={() => {
            return <Skeleton width={"100%"} height={verticalScale(250)} />;
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LayoutAnimationConfig skipEntering>
        <Animated.FlatList
          key={"habit-list"}
          initialNumToRender={2}
          layout={LinearTransition.springify().damping(40).stiffness(200)}
          onScroll={(e) => {
            scrollY.value = e.nativeEvent.contentOffset.y;
          }}
          contentContainerStyle={{
            gap: verticalScale(16),
            paddingBottom: verticalScale(150),
          }}
          data={habitList}
          renderItem={({ item }) => <HabitCard {...item} />}
        />
      </LayoutAnimationConfig>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(16),
  },
});

export default HabitList;
