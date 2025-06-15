import React, { useState } from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";

interface ExpandableTextProps {
  content: string;
  numberOfLines?: number;
  textStyle?: StyleProp<TextStyle>;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  content,
  numberOfLines = 2,
  textStyle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [textShown, setTextShown] = useState(false);

  const toggleText = () => setExpanded(!expanded);

  return (
    <View>
      <ThemedText
        onPress={toggleText}
        style={[{ fontSize: getFontSize(14) }, textStyle]}
        numberOfLines={expanded ? undefined : numberOfLines}
        onTextLayout={(e) => {
          const lines = e.nativeEvent.lines.length;
          if (lines > numberOfLines) setTextShown(true);
        }}
      >
        {content}
      </ThemedText>

      {textShown && (
        <TouchableOpacity onPress={toggleText}>
          <Text
            style={[
              {
                color: "rgba(138, 43, 226, 1)",
                marginTop: 4,
                fontSize: getFontSize(12),
                fontFamily: "PoppinsSemiBold",
              },
              textStyle,
            ]}
          >
            {expanded ? "Show less" : "Show more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ExpandableText;
