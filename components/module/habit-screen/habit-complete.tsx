import { horizontalScale } from "@/metric";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CompletedIcon from "@/assets/svg/completed-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
type Props = {
  completedValue?: number;
  notCompletedValue?: number;
};

const convertToPercentage = (value: number, total: number) => {
  return Math.round((value / total) * 100);
};

const HabitComplete = ({ completedValue, notCompletedValue }: Props) => {
  const [percentage, setPercentage] = React.useState(0);
//   console.log("completedValue", completedValue,notCompletedValue);
  
 useEffect(() => {
   if (
     typeof completedValue === "number" &&
     typeof notCompletedValue === "number" &&
     !isNaN(completedValue) &&
     !isNaN(notCompletedValue)
   ) {
     const total = completedValue + notCompletedValue;
     if (total > 0) {
       const percentage = convertToPercentage(completedValue, total);
    //    console.log("Total Percentage==>", percentage);
       setPercentage(percentage);
     } else {
       setPercentage(0); // If total is 0, set percentage to 0%
     }
   } else {
     setPercentage(0); // Handle undefined or invalid values gracefully
   }
 }, [completedValue, notCompletedValue]);

  return (
    <View style={styles.container}>
      <CompletedIcon />
      <ThemedText
        style={{ fontSize: getFontSize(12), fontFamily: "PoppinsSemiBold" }}
      >
        {percentage}%
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
});

export default HabitComplete;
