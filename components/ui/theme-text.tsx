import { getFontSize } from "@/font";
import { Text, TextProps } from "react-native";

export function ThemedText({ style, ...props }: TextProps & { font?: string }) {
  return (
    <Text
      style={[
        {
          color: "white", // Adjust text color based on theme
          fontFamily: "Poppins_400Regular",
          fontSize: getFontSize(16),
          includeFontPadding: false,
          textShadowColor: "transparent",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 0,
        },
        style,
      ]}
      {...props}
    />
  );
}
