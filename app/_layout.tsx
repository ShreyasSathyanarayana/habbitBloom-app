import { getFontSize } from "@/font";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ToastProvider,
  ToastType,
  useToast,
} from "react-native-toast-notifications";
// import {
//   useFonts,
// } from "@expo-google-fonts/poppins";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Providers from "@/components/Provider";

import { Slot, SplashScreen, useRouter } from "expo-router";

import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ui/theme-text";
import CheckIcon from "@/assets/svg/check_circle.svg";
import WrongIcon from "@/assets/svg/cancel.svg";
import InfoIcon from "@/assets/svg/Info.svg";
import { horizontalScale } from "@/metric";
import { useFonts } from "expo-font";
import { sendOTP } from "@/api/auth-api";
import { SheetProvider } from "react-native-actions-sheet";
import "@/action-sheets/sheet";
import { setupDatabase, syncHabitsToSupabase } from "@/database/db";
import "react-native-reanimated";
import "react-native-gesture-handler";

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
  const toast = useToast();

  const [load, error] = useFonts({
    PoppinsRegular: require("@/assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("@/assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    setupDatabase(); // Ensure database is set up
  }, []);

  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
      // toast.show("Testing");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const token = await SecureStore.getItemAsync("refreshToken");
      // const otp = sendOTP('shreyas24s2001@gmail.com')
      const isAuthenticated = !!token;
      if (isAuthenticated) {
        if (false) {
          // isTokenExpiered(token)
          logout();
        } else {
          router.replace("/(protected)/(tabs)");
        }
      } else {
        router.replace("/onboarding"); // /onboarding
        // toast.show("hlsdjl")
      }
    })();
  }, []);
  return <Slot />;
};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export const RootLayoutWrapper = () => {
  return (
    <KeyboardProvider>
      <SheetProvider>
        <Providers>
          <ToastProvider
            placement="top"
            duration={5000}
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
            offset={10} // offset for both top and bottom toasts
            offsetTop={10}
            offsetBottom={40}
            swipeEnabled={true}
            renderToast={(toast) => (
              <CustomToast
                message={toast.message}
                type={toast.type as unknown as ToastType}
                id={toast.id}
              />
            )}
          >
            {/* <StatusBar hidden={true} /> */}
            <RootLayout />
          </ToastProvider>
        </Providers>
      </SheetProvider>
    </KeyboardProvider>
  );
};

export default RootLayoutWrapper;

interface CustomToastProps {
  message: React.ReactNode;
  type: ToastType | string;
}

const CustomToast: React.FC<CustomToastProps & { id: string }> = ({
  message,
  type,
  id,
}) => {
  const toast = useToast();
  const { top: marginTopValue } = useSafeAreaInsets();

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          // <Ionicons
          //   style={{
          //     backgroundColor: "rgba(62, 77, 71, 0.8)",
          //     padding: 2,
          //     borderRadius: 60,
          //   }}
          //   name="checkmark-circle"
          //   size={24}
          //   color="rgba(1, 225, 123, 1)"
          // />
          <View style={styles.toastIconContainer}>
            <CheckIcon
              width={horizontalScale(24)}
              height={horizontalScale(24)}
            />
          </View>
        );
      case "danger":
        return (
          <View
            style={[
              styles.toastIconContainer,
              { backgroundColor: "rgba(97, 48, 50, 0.8)" },
            ]}
          >
            <WrongIcon
              width={horizontalScale(24)}
              height={horizontalScale(24)}
            />
          </View>
        );
      case "warning":
        return (
          <View
            style={[
              styles.toastIconContainer,
              { backgroundColor: "rgba(80, 78, 70, 0.8)" },
            ]}
          >
            <InfoIcon
              width={horizontalScale(24)}
              height={horizontalScale(24)}
            />
          </View>
        );
      default:
        return <Ionicons name="information-circle" size={24} color="gray" />;
    }
  };

  const getGradientColor = (): [string, string, ...string[]] => {
    switch (type) {
      case "success":
        return ["#4B6F60", "#343836"];
      case "danger":
        return ["rgba(144, 79, 80, 1)", "rgba(69, 62, 62, 1)"];
      case "warning":
        return ["rgba(129, 118, 73, 1)", "rgba(57, 56, 54, 1)"];
      default:
        return ["gray", "black"]; // Added fallback gradient
    }
  };

  const toastColor: Record<string, string> = {
    success: "rgba(1, 225, 123, 1)",
    danger: "rgba(250, 1, 2, 1)",
    warning: "rgba(255, 210, 31, 1)",
  };
  return (
    <LinearGradient
      colors={getGradientColor()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.toastContainer,
        { marginTop: Platform.OS == "android" ? marginTopValue : 0 },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "80%",
            gap: horizontalScale(5),
          }}
        >
          {getIcon()}
          <ThemedText
            numberOfLines={2}
            adjustsFontSizeToFit
            style={styles.toastText}
          >
            {message}
          </ThemedText>
        </View>
        <TouchableOpacity onPress={() => toast.hide(id)}>
          <AntDesign
            name="close"
            size={getFontSize(24)}
            color={toastColor[type.toString()] || "white"}
            style={[styles.closeButton]}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          height: 6,
          backgroundColor: toastColor[type.toString()] || "white",
          // position: 'static',
          // bottom: 0,
          // right: 0,
        }}
      ></View>
    </LinearGradient>
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
    // flexDirection: "row",
    // alignItems: "center",
    // padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
    elevation: 5,
    width: "90%",
    justifyContent: "space-between",
    marginVertical: 10,
    overflow: "hidden",
    // borderWidth: 5,
    // borderColor: "green",
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
    fontSize: getFontSize(15),
    fontWeight: "bold",
    fontFamily: "PoppinsBold",
    // color: "#333",
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
  closeButton: {},
  toastIconContainer: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(62, 77, 71, 0.8)",
    borderRadius: 150,
  },
});

// export default App;
