import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function Layout() {
  return (
    <KeyboardProvider>
      <Stack />
    </KeyboardProvider>
  );
}
