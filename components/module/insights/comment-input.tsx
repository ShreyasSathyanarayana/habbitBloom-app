import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import CommentAvatar from "./comment-avatar";
import CommentSubmitIcon from "@/assets/svg/comment-submit-icon.svg";
import { getFontSize } from "@/font";
import { ThemedText } from "@/components/ui/theme-text";
import CancelIcon from "@/assets/svg/cancel-icon.svg";
const _iconSize = horizontalScale(24);

const _cancelSize = horizontalScale(18);

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  userImage: string;
  isLoading: boolean;
  parentId: string | null;
  onCancelParentId: () => void;
  parentUserName: string;
};

const CommentInput: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmit,
  userImage,
  isLoading,
  parentId,
  onCancelParentId,
  parentUserName,
}) => {
  const [inputHeight, setInputHeight] = useState(horizontalScale(48));

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(Math.max(horizontalScale(48), height));
  };

  return (
    <View
      onTouchStart={() => Keyboard.dismiss()}
      style={[styles.container, parentId && { alignItems: "center" }]}
    >
      <CommentAvatar uri={userImage} />
      <View
        style={[
          styles.inputContainer,
          parentId && { height: verticalScale(100) },
        ]}
      >
        {parentId && (
          <View style={styles.userNameContainer}>
            <ThemedText style={styles.replyUserName}>
              {parentUserName}
            </ThemedText>
            <TouchableOpacity hitSlop={10} onPress={onCancelParentId}>
              <CancelIcon width={_cancelSize} height={_cancelSize} />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          multiline
          maxLength={500}
          value={value}
          onChangeText={onChangeText}
          style={[styles.inputStyle, { height: inputHeight }]}
          placeholder={"Type your comment"}
          placeholderTextColor={"white"}
          textAlignVertical="center"
          onContentSizeChange={handleContentSizeChange}
        />
      </View>
      <CommentSubmit
        onPress={onSubmit}
        disabled={value?.length === 0}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(20),
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(8),
    // backgroundColor: "rgba(0, 0, 0, 1)",
  },
  commentSubmit: {
    backgroundColor: "rgba(138, 43, 226, 1)",
    width: horizontalScale(38),
    height: horizontalScale(38),
    borderRadius: horizontalScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    // backgroundColor: "white",
    flex: 1,
    height: horizontalScale(48),
    fontSize: getFontSize(14),

    borderRadius: horizontalScale(8),
    color: "white",
    paddingLeft: horizontalScale(16),
    fontFamily: "PoppinsRegular",
    includeFontPadding: false,
    maxHeight: horizontalScale(100),
  },
  inputContainer: {
    borderWidth: horizontalScale(1),
    borderColor: "rgba(255, 255, 255, 0.18)",
    flex: 1,
    height: verticalScale(48),
    borderRadius: horizontalScale(16),
    overflow: "hidden",
  },
  replyUserName: {
    fontSize: getFontSize(12),
  },
  userNameContainer: {
    backgroundColor: "black",
    paddingLeft: horizontalScale(16),
    paddingRight: horizontalScale(8),
    paddingVertical: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default CommentInput;

const CommentSubmit = ({
  onPress,
  style,
  disabled,
  isLoading = false,
  ...props
}: TouchableOpacityProps & { isLoading: boolean }) => {
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.commentSubmit,
        style,
        disabled && !isLoading && { opacity: 0.6 },
      ]}
    >
      {!isLoading && (
        <CommentSubmitIcon
          style={(disabled || isLoading) && { opacity: 0.6 }}
          width={_iconSize}
          height={_iconSize}
        />
      )}
      {isLoading && (
        <ActivityIndicator
          style={{ zIndex: 1 }}
          size={"small"}
          color={"white"}
        />
      )}
    </TouchableOpacity>
  );
};
