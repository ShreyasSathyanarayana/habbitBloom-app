import { getFontSize } from "@/font";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ToastProvider, ToastType } from "react-native-toast-notifications";
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
import { StatusBar } from "expo-status-bar";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

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
    Poppins_400Regular,
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
        router.replace("/onboarding"); // /onboarding
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
          duration={3000}
          animationType="slide-in"
          animationDuration={400}
          successColor="green"
          dangerColor="red"
          warningColor="orange"
          normalColor="gray"
          // icon={<Icon />}
          successIcon={
            <AntDesign size={24} color={"white"} name="checkcircle" />
          }
          dangerIcon={
            <AntDesign size={24} color={"white"} name="closecircle" />
          }
          // warningIcon={<WarningIcon />}
          textStyle={{ fontSize: getFontSize(16) }}
          offset={50} // offset for both top and bottom toasts
          offsetTop={30}
          offsetBottom={40}
          swipeEnabled={true}
          renderToast={(toast) => (
            <CustomToast
              message={toast.message}
              type={toast.type as ToastType}
            />
          )}
        >
          <StatusBar hidden={true} />
          <RootLayout />
        </ToastProvider>
      </Providers>
    </KeyboardProvider>
  );
};

export default RootLayoutWrapper;

interface CustomToastProps {
  message: string;
  type: ToastType;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, type }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <Ionicons name="checkmark-circle" size={24} color="green" />;
      case "danger":
        return <Ionicons name="close-circle" size={24} color="red" />;
      case "warning":
        return <Ionicons name="alert-circle" size={24} color="orange" />;
      default:
        return <Ionicons name="information-circle" size={24} color="gray" />;
    }
  };

  return (
    <View style={[styles.toastContainer, styles[type]]}>
      {getIcon()}
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
    elevation: 5,
    width: "90%",
  },
  success: {
    backgroundColor: "#E6F4EA",
    borderLeftWidth: 5,
    borderLeftColor: "green",
  },
  danger: {
    backgroundColor: "#FDE2E2",
    borderLeftWidth: 5,
    borderLeftColor: "red",
  },
  warning: {
    backgroundColor: "#FFF4E5",
    borderLeftWidth: 5,
    borderLeftColor: "orange",
  },
  toastText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// export default App;
