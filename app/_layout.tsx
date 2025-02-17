import { getFontSize } from "@/font";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ToastProvider } from "react-native-toast-notifications";
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Providers from "@/components/Provider";

import { Slot, SplashScreen, useRouter } from "expo-router";

import * as SecureStore from "expo-secure-store";

// SplashScreen.preventAutoHideAsync();

// export default function Layout() {
//   const [loaded, error] = useFonts({
//     Poppins_100Thin,
//     Poppins_600SemiBold,
//   });

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   return (
//     <KeyboardProvider>
//       <Providers>
//         <ToastProvider
//           placement="top"
//           duration={100}
//           animationType="slide-in"
//           animationDuration={400}
//           successColor="green"
//           dangerColor="red"
//           warningColor="orange"
//           normalColor="gray"
//           // icon={<Icon />}
//           // successIcon={<SuccessIcon />}
//           // dangerIcon={<DangerIcon />}
//           // warningIcon={<WarningIcon />}
//           textStyle={{ fontSize: getFontSize(16) }}
//           offset={50} // offset for both top and bottom toasts
//           offsetTop={30}
//           offsetBottom={40}
//           swipeEnabled={true}
//         >
//           <Stack
//             screenOptions={{
//               headerShown: false,
//             }}
//           />
//         </ToastProvider>
//       </Providers>
//     </KeyboardProvider>
//   );
// }

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const [load, error] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular
  });

  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const token = await SecureStore.getItemAsync("refreshToken");
      const isAuthenticated = !!token;
      if (isAuthenticated) {
        if (false) {
          // isTokenExpiered(token)
          logout();
        } else {
          router.replace("/home");
        }
      } else {
        router.replace("/onboarding");
      }
    })();
  }, []);
  return <Slot />;
};

export const RootLayoutWrapper = () => {
  return (
    <KeyboardProvider>
      <Providers>
        <ToastProvider
          placement="top"
          duration={100}
          animationType="slide-in"
          animationDuration={400}
          successColor="green"
          dangerColor="red"
          warningColor="orange"
          normalColor="gray"
          // icon={<Icon />}
          // successIcon={<SuccessIcon />}
          // dangerIcon={<DangerIcon />}
          // warningIcon={<WarningIcon />}
          textStyle={{ fontSize: getFontSize(16) }}
          offset={50} // offset for both top and bottom toasts
          offsetTop={30}
          offsetBottom={40}
          swipeEnabled={true}
        >
          <RootLayout />
        </ToastProvider>
      </Providers>
    </KeyboardProvider>
  );
};

export default RootLayoutWrapper;
