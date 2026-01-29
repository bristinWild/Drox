import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { router } from "expo-router";
import { getAccessToken } from "@/constants/auth";
import { useAuth } from "@/hooks/useAuth";
import { getMe } from "@/api/auth";


export default function PinSetupScreen() {
    const [pin, setPin] = useState("");
    const [confirm, setConfirm] = useState("");
    const { login } = useAuth();
    const { setUser } = useAuth();

    const { updateUserAndRoute } = useAuth();
    const handleContinue = async () => {
        if (pin.length !== 6 || pin !== confirm) return;

        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        // 1️⃣ Set PIN in backend
        const res = await fetch("http://192.168.1.12:3000/auth/set-pin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ pin }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("SET PIN FAILED:", err);
            throw new Error("Failed to set PIN");
        }


        const me = await getMe(accessToken);


        updateUserAndRoute(me, true);

    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
                <Text style={styles.title}>
                    Create your <Text style={styles.highlight}>PIN</Text>
                </Text>

                <Text style={styles.subtitle}>
                    Use this PIN to log in faster next time.
                </Text>

                <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={6}
                    placeholder="Enter PIN"
                    value={pin}
                    onChangeText={setPin}
                />

                <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={6}
                    placeholder="Confirm PIN"
                    value={confirm}
                    onChangeText={setConfirm}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        !(pin.length === 6 && pin === confirm) && { opacity: 0.4 },
                    ]}
                    disabled={pin.length !== 6 || pin !== confirm}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>CONTINUE</Text>
                </TouchableOpacity>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 110,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#8B2F4B",
        marginBottom: 6,
    },

    highlight: {
        color: "#E6A57E",
        fontFamily: "Marker Felt",
    },

    subtitle: {
        color: "#5A3F4A",
        fontSize: 14,
        marginBottom: 40,
    },

    input: {
        borderWidth: 1,
        borderColor: "#D6E3F0",
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        fontSize: 18,
        textAlign: "center",
        letterSpacing: 8,
        marginBottom: 16,
    },

    label: {
        color: "#7B8A99",
        marginBottom: 8,
        marginTop: 12,
    },

    dotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16,
    },

    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#D6E3F0",
        marginHorizontal: 8,
    },

    dotFilled: {
        backgroundColor: "#5674A6",
    },

    keypad: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 20,
    },

    key: {
        width: "30%",
        margin: "1.5%",
        height: 56,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },

    deleteKey: {
        backgroundColor: "#F3F6FA",
    },

    keyText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#8B2F4B",
    },

    button: {
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        marginTop: 30,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1,
    },
});

