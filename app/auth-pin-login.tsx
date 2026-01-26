import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { hasPin, loginWithPin } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function PinLoginScreen() {
    const { login, unlockWithPin } = useAuth();

    const [countryCode, setCountryCode] = useState<CountryCode>("US");
    const [callingCode, setCallingCode] = useState<string>("1");
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const [step, setStep] = useState<"PHONE" | "PIN">("PHONE");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fullPhone = `+${callingCode}${phone}`;

    const checkPin = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await hasPin(fullPhone);

            if (!res.hasPin) {
                setError("No PIN found. Please login using OTP.");
                return;
            }

            router.push({
                pathname: "/auth-pin-verify",
                params: { phone: fullPhone },
            });
        } catch {
            setError("Failed to verify phone");
        } finally {
            setLoading(false);
        }
    };

    const submitPin = async () => {
        const res = await loginWithPin(fullPhone, pin);

        await login(res.accessToken, res.refreshToken);

        unlockWithPin(); // 🔐 unlock app

        // router.replace("/(tabs)");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
                <Text style={styles.title}>
                    Welcome back to <Text style={styles.highlight}>DROX</Text>
                </Text>

                {step === "PHONE" && (
                    <>
                        <View style={styles.phoneRow}>
                            <CountryPicker
                                countryCode={countryCode}
                                withFilter
                                withFlag
                                withCallingCode
                                withEmoji
                                onSelect={(country: Country) => {
                                    setCountryCode(country.cca2);
                                    setCallingCode(country.callingCode[0]);
                                }}
                            />
                            <Text style={styles.code}>+{callingCode}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone number"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={checkPin}>
                            <Text style={styles.buttonText}>
                                {loading ? "CHECKING..." : "CONTINUE"}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {step === "PIN" && (
                    <>
                        <TextInput
                            style={styles.pinInput}
                            placeholder="Enter 6-digit PIN"
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
                    </>
                )}

                {error ? <Text style={styles.error}>{error}</Text> : null}
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 120,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#8B2F4B",
        marginBottom: 30,
    },
    highlight: {
        color: "#E6A57E",
        fontFamily: "Marker Felt",
    },
    phoneRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    code: {
        marginHorizontal: 8,
        fontWeight: "600",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        backgroundColor: "#FFF",
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
