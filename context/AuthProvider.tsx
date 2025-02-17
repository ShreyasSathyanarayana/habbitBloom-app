import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
// import { isTokenExpired } from "../utils/helpers";

interface Login {
  accessToken: string;
  refreshToken: string;
}

interface AuthContext {
  login: (arg: Login) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const login = async (arg: Login) => {
    const { accessToken, refreshToken } = arg;
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    if (router.canDismiss()) {
      router.dismissAll();
    }
    // router.replace("/(protected)/(tabs)/home");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace("/");
    router.push("/onboarding");
  };

  const value = {
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
