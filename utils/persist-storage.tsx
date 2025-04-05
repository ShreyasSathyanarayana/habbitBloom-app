import { tokenKeys } from "@/context/AuthProvider";
import * as SecureStore from "expo-secure-store";
import { storage } from "./storage";

export const getUserId = async (): Promise<string | null> => {
  const userId = storage.getString(tokenKeys.accessToken);
  // console.log("User ID from storage:", userId);

  return userId || null;
};

export const getLoginMode = () => {
  return storage.getString(tokenKeys.loginMode);
};

export const getPassword = () => {
  return storage.getString(tokenKeys.password);
};

export const setPassword = (password: string) => {
  return storage.set(tokenKeys.password, password);
};
