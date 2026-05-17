import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { Stack } from "expo-router";
import React from "react";

const GroupLayout = () => {
  const mode = useThemeStore((s) => s.theme);
  const { background } = mode === "dark" ? darkTheme : lightTheme;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="joinedgroup" />
      <Stack.Screen name="createdgroup" />
    </Stack>
  );
};

export default GroupLayout;
