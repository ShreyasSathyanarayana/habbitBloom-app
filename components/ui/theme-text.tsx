import { getFontSize } from "@/font";
import { Text, TextProps } from "react-native";

export function ThemedText({ style, ...props }: TextProps & { font?: string }) {
  return (
    <Text
      allowFontScaling={false}
      
      style={[
        {
          color: "#FFFFFF", // Adjust text color based on theme
          fontFamily: "PoppinsRegular",
          fontSize: getFontSize(16),
          includeFontPadding: false,
          textShadowColor: "transparent",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 0,
          backgroundColor: "transparent",
        
          // backgroundColor: "#121212",
        },
        style,
      ]}
      {...props}
    />
  );
}
