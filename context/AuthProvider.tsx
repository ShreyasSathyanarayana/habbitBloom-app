import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";

interface Login {
  accessToken: string;
  refreshToken: string;
}

interface AuthContext {
  login: (arg: Login) => Promise<void>;
  logout: () => Promise<void>;
  user_id: string;
  isConnected: boolean;
}
export const tokenKeys = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
};

const AuthContext = createContext<AuthContext | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userid, setUserId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const login = async (arg: Login) => {
    try {
      const { accessToken, refreshToken } = arg;

      // Store tokens in SecureStore (Offload to background)
      await Promise.all([
        SecureStore.setItemAsync("accessToken", accessToken),
        SecureStore.setItemAsync("refreshToken", refreshToken),
      ]);

      // Update user ID after SecureStore operation completes
      // setUserId(accessToken);

      // Perform navigation after a slight delay to allow UI to stabilize
      setTimeout(() => {
        if (router.canDismiss()) router.dismissAll();
        router.replace("/(protected)/(tabs)");
      }, 50);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      // Delete tokens
      await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("refreshToken"),
      ]);

      // setUserId("");

      // Navigate out of protected routes
      setTimeout(() => {
        if (router.canDismiss()) router.dismissAll();
        router.replace("/(not-auth)/(auth)/weclome-screen");
      }, 50);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, user_id: userid, isConnected }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
