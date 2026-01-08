import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";
import { getAccessToken as getToken } from "@/constants/auth";


export default function RootLayout() {
    // const [checkingAuth, setCheckingAuth] = useState(true);

    // useEffect(() => {
    //     async function bootstrap() {
    //         const token = await getToken();

    //         if (token) {
    //             router.replace("/(tabs)");
    //         } else {
    //             router.replace("/auth");
    //         }

    //         setCheckingAuth(false);
    //     }

    //     bootstrap();
    // }, []);
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}

