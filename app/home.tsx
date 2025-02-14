import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

export default function FormScreen() {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={65}
        contentContainerStyle={styles.container}
      >
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: "auto",
    flexGrow: 1,
    flexShrink: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d8d8d8",
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 8,
  },
});
