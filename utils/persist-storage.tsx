import { tokenKeys } from "@/context/AuthProvider";
import * as SecureStore from "expo-secure-store";
import { storage } from "./storage";

export const getUserId = (): string | null => {
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

export const getUserRole = () => {
  return storage.getString(tokenKeys.role);
  // console.log("User Role from storage:", data, error);
};

export const isUserSubscribed = () => {
  const role = getUserRole();
  if (role == "user") {
    return false;
  }
  return true;
};

export const setNumberReadSuggestion = (number: number) => {
  return storage.set("readSuggestion", number);
};

export const getReadSuggestion = () => {
  return storage.getNumber("readSuggestion") ?? 0;
};
