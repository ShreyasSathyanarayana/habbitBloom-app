import LinerGradientContainer from "@/components/ui/liner-gradient-container";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onChangeMenu: (item: string, index: number) => void;
  menu: string[];
  selectedMenu?: string;
};

// const menu = ["Weekly", "Monthly", "Year"];
const { width } = Dimensions.get("window");
// padding(16+16) +spacing(2+2)

const AnalyticsBar = ({ onChangeMenu, menu, selectedMenu }: Props) => {
  const [selected, setSelected] = useState(selectedMenu ?? menu[0]);
  const _selectedWidth = (width - horizontalScale(38)) / menu?.length;
  useEffect(() => {
    const initialIndex = menu.indexOf(selectedMenu ?? menu[0]);
    if (initialIndex !== -1) {
      positionX.value = initialIndex * _selectedWidth;
    }
  }, [selectedMenu]);

  const positionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(positionX.value, {
            damping: 40,
            stiffness: 200,
          }),
        },
      ],
    };
  });
  const onPressMenu = (item: string, index: number) => {
    setSelected(item);
    onChangeMenu(item, index);
    positionX.value = index * _selectedWidth;
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          //   justifyContent: "space-between",
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              left: horizontalScale(1),
              // height: "100%",
            },
            animatedStyle,
          ]}
        >
          <LinerGradientContainer
            style={{
              width: _selectedWidth,
              borderRadius: horizontalScale(8),
            }}
          ></LinerGradientContainer>
        </Animated.View>
        {menu.map((item, index) => (
          <Pressable
            onPress={() => onPressMenu(item, index)}
            style={{
              flex: 1,
              paddingVertical: verticalScale(8),
              justifyContent: "center",
              alignItems: "center",
            }}
            key={index}
          >
            <ThemedText
              key={index}
              style={{
                fontSize: horizontalScale(14),
                color: selected == item ? "white" : "rgba(104, 104, 115, 1)",
                fontFamily:
                  selected == item ? "PoppinsSemiBold" : "PoppinsRegular",
              }}
            >
              {item}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: horizontalScale(2),
    borderRadius: horizontalScale(8),
  },
});

export default AnalyticsBar;
