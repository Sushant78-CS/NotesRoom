import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useLocalSearchParams } from "expo-router";

const GroupDetailLayout = () => {
  const { id } = useLocalSearchParams();
  const mode = useThemeStore((s) => s.theme);
  const { background, text, primary, activeTab, inactiveTab } =
    mode === "dark" ? darkTheme : lightTheme;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: background,
        },
        tabBarActiveTintColor: activeTab,
        tabBarInactiveTintColor: inactiveTab,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{ id }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={24} color={color} />
          ),
          tabBarLabel: "Notes",
        }}
      />
      <Tabs.Screen
        name="members"
        initialParams={{ id }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
          tabBarLabel: "Members",
        }}
      />
    </Tabs>
  );
};

export default GroupDetailLayout;
