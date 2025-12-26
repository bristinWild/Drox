import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import CountryPicker, {
    Country,
    CountryCode,
} from "react-native-country-picker-modal";
import { useState, useEffect } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();



export default function AuthScreen() {

    const [countryCode, setCountryCode] = useState<CountryCode>("US");
    const [callingCode, setCallingCode] = useState("1");
    const [phone, setPhone] = useState("");


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
        <LinearGradient
            colors={["#0B0F14", "#121826"]}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* Back Button */}
            <TouchableOpacity onPress={() => router.push("/index")} style={styles.backButton}>
                <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Join the Grid.</Text>
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
                    placeholderTextColor="#6B7280"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.phoneInput}
                />
            </View>


            {/* CTA */}
            <TouchableOpacity style={styles.smsButton}>
                <Text style={styles.smsText}>SEND CODE VIA SMS</Text>
            </TouchableOpacity>

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
                    style={{ height: 48, marginBottom: 12 }}
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
    },

    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },
    backArrow: {
        color: "#FFFFFF",
        fontSize: 26,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 34,
        fontWeight: "800",
        marginBottom: 10,
    },

    subtitle: {
        color: "#9CA3AF",
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
        borderColor: "#374151",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginRight: 10,
    },

    flag: {
        fontSize: 18,
        marginRight: 6,
    },

    code: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },

    phoneInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#22D3EE",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#FFFFFF",
        fontSize: 16,
        shadowColor: "#22D3EE",
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },

    smsButton: {
        backgroundColor: "#D9F50A",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 26,
    },

    smsText: {
        color: "#0B0F14",
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
        backgroundColor: "#374151",
    },

    orText: {
        color: "#9CA3AF",
        marginHorizontal: 12,
        fontSize: 13,
    },

    socialButton: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
    },

    socialText: {
        color: "#0B0F14",
        fontSize: 15,
        fontWeight: "600",
    },

    footer: {
        marginTop: 30,
        color: "#9CA3AF",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 18,
    },

    link: {
        color: "#22D3EE",
        fontWeight: "600",
    },
});
