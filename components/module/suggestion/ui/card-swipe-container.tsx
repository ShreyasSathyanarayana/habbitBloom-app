import { getFontSize } from "@/font";
import { horizontalScale, verticalScale } from "@/metric";
import { Button, ListItem } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";
import TrashCanOutlineIcon from "@/assets/svg/trash-can-outline.svg";

interface CardSwipeContainerProps {
  id: string;
  handleDelete: (id: string) => void;
  children: React.ReactNode;
}

const CardSwipeContainer = ({
  id,
  handleDelete,
  children,
}: CardSwipeContainerProps) => {
  return (
    <ListItem.Swipeable
      //   leftContent={(reset) => (
      //     <Button
      //       title="Info"
      //       onPress={() => reset()}
      //       icon={{ name: "info", color: "white" }}
      //       buttonStyle={{ minHeight: "100%" }}
      //     />
      //   )}

      containerStyle={styles.container}
      leftWidth={0}
      rightWidth={horizontalScale(60)}
      rightContent={(reset) => (
        <Button
          //   title="Delete"
          titleStyle={{
            fontSize: getFontSize(12),
            fontFamily: "PoppinsMedium",
          }}
          onPress={() => {
            reset();
            handleDelete(id);
          }}
          icon={<TrashCanOutlineIcon />}
          buttonStyle={{
            minHeight: "100%",
            backgroundColor: "rgba(255, 97, 97, 1)",
          }}
        />
      )}
    >
      <ListItem.Content>{children}</ListItem.Content>
    </ListItem.Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: verticalScale(16) ?? 16,
  },
});

export default CardSwipeContainer;
