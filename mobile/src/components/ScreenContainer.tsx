import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";

type ScreenContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export default function ScreenContainer({
  children,
  scroll = false,
  style,
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});