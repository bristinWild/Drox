import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/constants/auth";

export default function RootLayout() {
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        async function bootstrap() {
            const token = await getToken();

            if (token) {
                router.replace("/(tabs)");
            } else {
                router.replace("/auth");
            }

            setCheckingAuth(false);
        }

        bootstrap();
    }, []);

    if (checkingAuth) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#0B0F14",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#22D3EE" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
