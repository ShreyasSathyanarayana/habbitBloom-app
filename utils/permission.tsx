import { Linking, Platform } from "react-native";

 export const openAppSettings = async () => {
  try {
    if (Platform.OS === "ios") {
      await Linking.openURL("app-settings:");
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.warn("Unable to open app settings:", error);
  }
};
