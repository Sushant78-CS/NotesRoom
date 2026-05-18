import { useAuth } from "@/hook/useAuth";
import { useThemeStore } from "@/store/themeStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "../api/interceptors";

function RootLayout() {
    const mode = useThemeStore((s) => s.theme);
    const barStyle = mode === "dark" ? "light-content" : "dark-content";

    const { user, isLoading, loadUser } = useAuth();

    useEffect(() => {
        loadUser();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={"#000"} />
            </View>
        );
    }

    return (
        <>
            <StatusBar backgroundColor="#fff" barStyle={barStyle} />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Protected guard={!user}>
                    <Stack.Screen name="(auth)" />
                </Stack.Protected>
                <Stack.Protected guard={!!user}>
                    <Stack.Screen name="screens" />
                </Stack.Protected>
            </Stack>
        </>
    );
}

export default function InitialLayout() {
    return <RootLayout />;
}
