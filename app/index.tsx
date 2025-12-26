import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";



export default function LandingScreen() {
    return (
        <LinearGradient
            colors={["#0B0F14", "#111827"]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>D</Text>
                <Text style={styles.logoText}>DROX</Text>
            </View>

            {/* Radar Graphic Placeholder */}
            <View style={styles.radarContainer}>
                <View style={styles.radarCircle} />
                <View style={styles.radarLine} />
            </View>

            {/* Headline */}
            <Text style={styles.title}>The Road{"\n"}is Talking.</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Instantly voice-connect with drivers around you.
                Traffic signals or highways, you're never alone.
            </Text>

            {/* CTA */}
            <TouchableOpacity onPress={() => router.push("/auth")} style={styles.ctaButton}>
                <Text style={styles.ctaText}>GET STARTED</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity>
                <Text onPress={() => router.push("/auth")} style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLink}>Log In</Text>
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },

    logoContainer: {
        position: "absolute",
        top: 60,
        left: 24,
        flexDirection: "row",
        alignItems: "center",
    },
    logoIcon: {
        color: "#22D3EE",
        fontSize: 26,
        fontWeight: "900",
        marginRight: 6,
    },
    logoText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 1,
    },

    radarContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    radarCircle: {
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 1,
        borderColor: "rgba(34,211,238,0.3)",
    },
    radarLine: {
        position: "absolute",
        width: 2,
        height: 130,
        backgroundColor: "#22D3EE",
        top: 0,
        transform: [{ rotate: "45deg" }],
    },

    title: {
        color: "#FFFFFF",
        fontSize: 38,
        fontWeight: "800",
        marginBottom: 16,
    },

    subtitle: {
        color: "#9CA3AF",
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
    },

    ctaButton: {
        backgroundColor: "#D9F50A",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 20,
    },
    ctaText: {
        color: "#0B0F14",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 1,
    },

    loginText: {
        color: "#9CA3AF",
        textAlign: "center",
        fontSize: 14,
    },
    loginLink: {
        color: "#22D3EE",
        fontWeight: "600",
    },
});
