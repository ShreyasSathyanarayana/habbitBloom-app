import { tokenKeys } from "@/context/AuthProvider";
import * as SecureStore from "expo-secure-store";

export const getUserId = async (): Promise<string | null> => {
  const userId = await SecureStore.getItemAsync(tokenKeys.accessToken);
  return userId || null;
};
