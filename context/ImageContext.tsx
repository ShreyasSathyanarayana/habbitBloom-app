import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import CancelIcon from "@/assets/svg/cancel-icon.svg";
import Animated, { ZoomIn } from "react-native-reanimated";
import { horizontalScale, verticalScale } from "@/metric";

const _iconSize = horizontalScale(30);

interface ImageContextType {
  showImage: (imageUri: string) => void;
}

const ImageContext = createContext<ImageContextType | null>(null);

export default function ImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const imageRef = useRef<{
    show: (uri: string) => void;
    hide: () => void;
  } | null>(null);

  const showImage = (imageUri: string) => {
    imageRef.current?.show(imageUri);
  };

  return (
    <ImageContext.Provider value={{ showImage }}>
      {children}
      <ImageView ref={imageRef} />
    </ImageContext.Provider>
  );
}

const ImageView = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const imageUriRef = useRef("");

  const hide = () => {
    setShow(false);
    imageUriRef.current = "";
  };

  useImperativeHandle(ref, () => ({
    hide,
    show: (uri = "") => {
      imageUriRef.current = uri;
      setShow(true);
    },
  }));

  // 🔙 BackHandler to intercept back button press
  useEffect(() => {
    if (!show) return;

    const onBackPress = () => {
      hide();
      return true; // prevent default back action
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayBackground} />
      <View style={styles.overlayContent}>
        <TouchableOpacity
          hitSlop={10}
          style={[styles.closeButton]}
          onPress={hide}
        >
          <CancelIcon width={_iconSize} height={_iconSize} />
        </TouchableOpacity>
        <Zoomable isDoubleTapEnabled>
          <Image
            source={{ uri: imageUriRef.current }}
            contentFit="contain"
            style={styles.fullScreenImage}
          />
        </Zoomable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000000,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(90, 90, 90, 0.5)",
    backgroundColor: "black",
  },
  overlayContent: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: verticalScale(50),
    right: horizontalScale(5),
    // padding: 5,
    // backgroundColor: "#007AFF",
    // borderRadius: 20,
    zIndex: 100001,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  fullScreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.5,
    marginTop:
      (Dimensions.get("window").height -
        Dimensions.get("window").height / 1.5) /
      2,
  },
});

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
}
