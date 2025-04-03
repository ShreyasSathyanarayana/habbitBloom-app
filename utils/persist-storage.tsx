import { tokenKeys } from "@/context/AuthProvider";
import * as SecureStore from "expo-secure-store";
import { storage } from "./storage";

export const getUserId = async (): Promise<string | null> => {
  const userId = storage.getString(tokenKeys.accessToken);
  // console.log("User ID from storage:", userId);

  return userId || null;
};
