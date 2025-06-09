import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { horizontalScale } from "@/metric";
const _iconSize = horizontalScale(24);

type Prop = {
  isLiked: boolean;
  onClick: () => void;
};

const LikeButton = ({ isLiked, onClick }: Prop) => {
  const liked = useSharedValue(isLiked ? 1 : 0);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], "clamp"),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
    };
  });
  const handleLikePress = () => {
    liked.value = withSpring(liked.value ? 0 : 1);
    onClick();
  };

  return (
    <Pressable onPress={handleLikePress}>
      <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
        <MaterialCommunityIcons
          name={"heart-outline"}
          size={_iconSize}
          color={"#D9D9D9"}
        />
      </Animated.View>
      <Animated.View style={fillStyle}>
        <MaterialCommunityIcons name={"heart"} size={_iconSize} color={"red"} />
      </Animated.View>
    </Pressable>
  );
};

export default LikeButton;
