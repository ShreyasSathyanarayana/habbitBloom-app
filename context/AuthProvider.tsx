import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";
import { storage } from "@/utils/storage";

interface Login {
  accessToken: string;
  refreshToken: string;
  loginMode: string;
  password: string;
}

interface AuthContext {
  login: (arg: Login) => Promise<void>;
  logout: () => Promise<void>;
  user_id: string;
  isConnected: boolean;
}
export const tokenKeys = {
  accessToken: "user.accessToken",
  refreshToken: "user.refreshToken",
  password: "user.password",
  loginMode: "user.loginMode",
};

const AuthContext = createContext<AuthContext | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userid, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginMode, setLoginMode] = useState<"normal" | "googleId" | "appleId">(
    "normal"
  );
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const login = async (arg: Login) => {
    try {
      const { accessToken, refreshToken, loginMode, password = "" } = arg;

      storage.set(tokenKeys.accessToken, accessToken);
      storage.set(tokenKeys.refreshToken, refreshToken);
      storage.set(tokenKeys.loginMode, loginMode);
      if (loginMode === "normal") {
        storage.set(tokenKeys.password, password);
      }

      // Store tokens in SecureStore (Offload to background)
      // await Promise.all([
      //   // SecureStore.setItemAsync("accessToken", accessToken),
      //   // SecureStore.setItemAsync("refreshToken", refreshToken),
      // ]);

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
      // await Promise.all([
      //   SecureStore.deleteItemAsync("accessToken"),
      //   SecureStore.deleteItemAsync("refreshToken"),
      // ]);
      storage.delete(tokenKeys.accessToken);
      storage.delete(tokenKeys.refreshToken);
      storage.delete(tokenKeys.password);
      storage.delete(tokenKeys.loginMode);

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
