import { Text, TextProps } from "react-native";

export function ThemedText({ style, ...props }: TextProps) {

  return (
    <Text
      style={[
        {
          color: "white", // Adjust text color based on theme
        },
        style,
      ]}
      {...props}
    />
  );
}
