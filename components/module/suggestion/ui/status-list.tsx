import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Chip from "./chip";
import { horizontalScale } from "@/metric";
type Option = {
  label: string;
  value: string;
};
type Props = {
  data: Option[];
  keyName: string;
  selectedValue: string;
  onClick: (value: string) => void;
} & TouchableOpacityProps;

const StatusList = ({
  data,
  keyName,
  onClick,
  selectedValue,
  ...rest
}: Props) => {
  const listRef = useRef<FlatList>(null);
  return (
    <FlatList
      ref={listRef}
      showsHorizontalScrollIndicator={false}
      data={data}
      horizontal
      keyExtractor={(_, index) => index.toString() + keyName}
      ItemSeparatorComponent={() => (
        <View style={{ width: horizontalScale(16) }} />
      )}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onClick(item?.value);
              listRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition:
                  index === 0 ? 0 : index != data?.length - 1 ? 0.5 : 1,
              });
            }}
            {...rest}
          >
            <Chip
              selected={selectedValue == item?.value}
              chipName={item?.label}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default StatusList;
