import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import CountryPicker, {
    Country,
    CountryCode,
} from "react-native-country-picker-modal";
import { useState, useEffect, use } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import { sendOtp, verifyOtp, checkHasPin, hasPin } from "@/api/auth";
import { saveTokens } from "@/constants/auth";
import { useAuth } from "@/hooks/useAuth";



WebBrowser.maybeCompleteAuthSession();


export default function AuthScreen() {

    const [countryCode, setCountryCode] = useState<CountryCode>("US");
    const [callingCode, setCallingCode] = useState("1");
    const [phone, setPhone] = useState("");
    const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const { login } = useAuth();

    const handleContinue = async () => {
        setLoading(true);
        setError("");

        const fullPhone = `+${callingCode}${phone}`;

        try {
            const res = await hasPin(fullPhone);

            if (res.hasPin) {
                router.push({
                    pathname: "/auth-pin-verify",
                    params: { phone: fullPhone },
                });
                return;
            }


            // New user → OTP
            await sendOtp(fullPhone);
            setStep("OTP");
            setCooldown(60);
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };




    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            setError("");

            const fullPhone = `+${callingCode}${phone}`;
            const res = await verifyOtp(fullPhone, otp);

            // 🔥 DO NOT ROUTE
            await login(res.accessToken, res.refreshToken);

        } catch {
            setError("Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!cooldown) return;

        const timer = setInterval(() => {
            setCooldown((c) => (c > 0 ? c - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);



    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "707815546142-pv58nu36unj5vjjekeiltotrmaipuhl6.apps.googleusercontent.com",
    });


    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            console.log("Access Token:", authentication?.accessToken);

            // Send accessToken to backend
        }
    }, [response]);







    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <LinearGradient
                    colors={["#B3E0F2", "#FFFFFF"]}
                    style={styles.container}
                >
                    <StatusBar style="light" />

                    {/* Back Button */}
                    <TouchableOpacity onPress={() => router.push("/index")} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.title}>Join the <Text style={styles.grid}>party.</Text></Text>
                    <Text style={styles.subtitle}>
                        Enter your mobile number to verify your account.
                        We hate spam too.
                    </Text>

                    {/* Phone Input */}
                    <View style={styles.phoneContainer}>
                        <TouchableOpacity style={styles.countryBox}>
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
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Phone number"
                            placeholderTextColor="#9AA6B2"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.phoneInput}
                        />
                    </View>


                    {/* OTP INPUT */}
                    {step === "OTP" && (
                        <>
                            <TextInput
                                placeholder="Enter 6-digit OTP"
                                placeholderTextColor="#9AA6B2"
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={6}
                                autoFocus
                                textContentType="oneTimeCode"
                                autoComplete="sms-otp"
                                style={styles.otpInput}
                            />

                            <TouchableOpacity
                                style={styles.smsButton}
                                onPress={handleVerifyOtp}
                                disabled={loading}
                            >
                                <Text style={styles.smsText}>
                                    {loading ? "VERIFYING..." : "VERIFY OTP"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={cooldown > 0}
                                onPress={handleContinue}
                            >
                                <Text style={{ color: "#E6A57E", textAlign: "center" }}>
                                    {cooldown > 0
                                        ? `Resend in ${cooldown}s`
                                        : "Resend OTP"}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* SEND OTP BUTTON */}
                    {step === "PHONE" && (
                        <TouchableOpacity
                            style={styles.smsButton}
                            onPress={handleContinue}
                            disabled={loading}
                        >
                            <Text style={styles.smsText}>
                                {loading ? "SENDING..." : "CONTINUE"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* ERROR */}
                    {error ? (
                        <Text style={{ color: "#F87171", marginBottom: 10 }}>
                            {error}
                        </Text>
                    ) : null}

                    {/* Divider */}
                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.divider} />
                    </View>
                    {/* Apple Login */}
                    {Platform.OS === "ios" && (
                        <AppleAuthentication.AppleAuthenticationButton
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={12}
                            style={{ height: 48, marginBottom: 16, marginTop: 6 }}
                            onPress={async () => {
                                const credential = await AppleAuthentication.signInAsync({
                                    requestedScopes: [
                                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                    ],
                                });

                                console.log("Apple user:", credential);
                                // send credential.identityToken to backend
                            }}
                        />
                    )}

                    {/* Google Login */}
                    <TouchableOpacity
                        style={styles.socialButton}
                        disabled={!request}
                        onPress={() => promptAsync()}
                    >
                        <Text style={styles.socialText}>Continue with Google</Text>
                    </TouchableOpacity>


                    {/* Footer */}
                    <Text style={styles.footer}>
                        By signing up, you agree to our{" "}
                        <Text style={styles.link}>Terms</Text> &{" "}
                        <Text style={styles.link}>Privacy Policy</Text>.
                        {"\n"}Drive safely.
                    </Text>
                </LinearGradient>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 110,
    },

    backButton: {
        position: "absolute",
        top: 65,
        left: 20,
    },
    backArrow: {
        color: "#8B2F4B",
        fontSize: 26,
        fontWeight: "700"
    },

    title: {
        color: "#8B2F4B",
        fontWeight: "800",
        marginBottom: 10,
        fontSize: 30,
        letterSpacing: -0.2,
    },



    subtitle: {
        color: "#5A3F4A",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 30,
    },

    phoneContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    countryBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D6E3F0",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginRight: 10,
    },

    grid: {
        color: "#E6A57E",
        fontFamily: "Marker Felt",
    },

    flag: {
        fontSize: 18,
        marginRight: 6,
    },

    code: {
        color: "#8B2F4B",
        fontSize: 15,
        fontWeight: "600",
    },

    otpInput: {
        borderWidth: 1,
        borderColor: "#D6E3F0",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#2E2E2E",
        fontSize: 16,
        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        marginBottom: 20,
        width: '60%',
        alignSelf: 'center',
        textAlign: 'center',
        backgroundColor: "#FFFFFF",
    },

    phoneInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#D6E3F0",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#2E2E2E",
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },

    smsButton: {
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        marginBottom: 26,
        shadowColor: "#5674A6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },

    smsText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1,
    },

    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5EDF5",
    },

    orText: {
        color: "#9AA6B2",
        marginHorizontal: 12,
        fontSize: 13,
    },

    socialButton: {
        backgroundColor: "#FFFFFF",
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,

        shadowColor: "#5674A6",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
    },


    socialText: {
        color: "#8B2F4B",
        fontSize: 15,
        fontWeight: "700",
    },

    footer: {
        marginTop: 30,
        color: "#7B8A99",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 18,
    },

    link: {
        color: "#E6A57E",
        fontWeight: "600",
    },
});


