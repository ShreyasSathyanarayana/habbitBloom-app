import { getAboutUs } from "@/api/api";
import AboutUsCard from "@/components/module/profile/about-us-card";
import ActionSheetContainer1 from "@/components/ui/action-sheet-container1";
import Divider from "@/components/ui/divider";
import { GradientButton } from "@/components/ui/gradient-button";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale, verticalScale } from "@/metric";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FlatList, SheetManager, SheetProps } from "react-native-actions-sheet";
const closeSheet = () => {
  SheetManager.hide("about-us");
};

const AboutUsSheet = (props: SheetProps<"about-us">) => {
  const getAboutUsQuery = useQuery({
    queryKey: ["about-us"],
    queryFn: () => {
      return getAboutUs();
    },
  });
//   console.log(
//     "About use Sheet ==>",
//     JSON.stringify(getAboutUsQuery.data, null, 2)
//   );

  return (
    <ActionSheetContainer1 sheetId={props.sheetId}>
      <View
        style={{
          gap: verticalScale(24),
          //   paddingHorizontal: horizontalScale(16),
        }}
      >
        <ThemedText
          style={{ textAlign: "center", fontFamily: "PoppinsSemiBold" }}
        >
          Creators of Habit Bloom
        </ThemedText>
        <Divider />
        <FlatList
          data={getAboutUsQuery?.data}
          numColumns={2}
          ItemSeparatorComponent={() => (
            <View
              style={{ width: horizontalScale(16), backgroundColor: "red" }}
            />
          )}
          keyExtractor={(_, index) => index.toString() + "About us"}
          renderItem={({ item }) => {
            return (
              <AboutUsCard
                profile_bio={item?.profile_bio}
                profile_pic={item?.profile_pic}
                email={item?.email}
                full_name={item?.full_name}
              />
            );
          }}
        />
        <GradientButton onPress={closeSheet} title="GOT IT!" />
      </View>
    </ActionSheetContainer1>
  );
};

const styles = StyleSheet.create({});

export default AboutUsSheet;
