import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/hooks/useAuth";

export default function RootLayout() {
    return (

        <AuthProvider>
            <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
        </AuthProvider>

    );
}
