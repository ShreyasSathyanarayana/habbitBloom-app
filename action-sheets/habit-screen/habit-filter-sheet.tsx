import ActionSheetButton from "@/components/action-sheet/actionsheet-button";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import { ThemedText } from "@/components/ui/theme-text";
import SortAlphabeticalIcon from "@/assets/svg/sort-alphabetical-icon.svg";
import SortLastestHabitIcon from "@/assets/svg/sort-latest-icon.svg";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { horizontalScale, verticalScale } from "@/metric";
const _iconSize = horizontalScale(24);
const closeSheet = () => {
  SheetManager.hide("habit-filter");
};

const HabitFilterSheet = (props: SheetProps<"habit-filter">) => {
  const payload = props.payload;
  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      <View style={{ gap: verticalScale(24) }}>
        <ActionSheetButton
          onPress={() => {
            closeSheet();
            payload?.setSelectedFilter("alphabetical");
            
          }}
          selected={payload?.selectedFilter === "alphabetical"}
          buttonName="Alphabetical order (A-Z)"
          leftIcon={
            <SortAlphabeticalIcon height={_iconSize} width={_iconSize} />
          }
        />
        <ActionSheetButton
          onPress={() => {
              closeSheet();
            payload?.setSelectedFilter("latest");
          
          }}
          selected={payload?.selectedFilter === "latest"}
          leftIcon={
            <SortLastestHabitIcon height={_iconSize} width={_iconSize} />
          }
          buttonName="Latest Created"
        />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default HabitFilterSheet;
