import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import AuthProvider from "@/context/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar
            style="light"
            // backgroundColor="#000"
            // hidden
          />
          <GestureHandlerRootView>
            {/* <BottomSheetModalProvider>{children}</BottomSheetModalProvider> */}
            {children}
          </GestureHandlerRootView>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default Providers;
