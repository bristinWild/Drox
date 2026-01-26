import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { loginWithPin } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

export default function PinVerifyScreen() {
    const { login } = useAuth();
    const { phone } = useLocalSearchParams<{ phone: string }>();

    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submitPin = async () => {
        try {
            setLoading(true);
            setError("");
            // console.log("PIN VERIFY PHONE:", phone);

            const res = await loginWithPin(phone!, pin);
            await login(res.accessToken, res.refreshToken); // ✅ ONLY THIS
        } catch {
            setError("Invalid PIN");
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
                <Text style={styles.title}>Enter your PIN</Text>

                <TextInput
                    style={styles.pinInput}
                    placeholder="6-digit PIN"
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={6}
                    value={pin}
                    onChangeText={setPin}
                />

                <TouchableOpacity style={styles.button} onPress={submitPin}>
                    <Text style={styles.buttonText}>
                        {loading ? "VERIFYING..." : "LOGIN"}
                    </Text>
                </TouchableOpacity>

                {error ? <Text style={styles.error}>{error}</Text> : null}
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 140,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#8B2F4B",
        marginBottom: 30,
        textAlign: "center",
    },
    pinInput: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        textAlign: "center",
        fontSize: 20,
        backgroundColor: "#FFF",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "800",
        letterSpacing: 1,
    },
    error: {
        color: "#F87171",
        marginTop: 20,
        textAlign: "center",
    },
});
