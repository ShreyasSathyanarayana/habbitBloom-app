import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import NetInfo from "@react-native-community/netinfo";
// import { isTokenExpired } from "../utils/helpers";

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

const AuthContext = createContext<AuthContext | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userid, setUserId] = React.useState<string>("");
  const [isConnected, setIsConnected] = React.useState<boolean>(true);
  const login = async (arg: Login) => {
    const { accessToken, refreshToken } = arg;
    setUserId(accessToken);
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    if (router.canDismiss()) {
      router.dismissAll();
    }
    // router.replace("/(protected)/(tabs)/home");
    router.dismissAll();
    router.replace("/(protected)/(tabs)");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    router.dismissAll();
    router.replace("/(not-auth)/(auth)/weclome-screen");
  };

  const value = {
    login,
    logout,
    user_id: userid,
    isConnected,
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected ?? false);
    });

    // To unsubscribe to these update, just use:
    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () => {
  const ctx = useContext<AuthContext | null>(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
