import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView } from "react-native";



export default function LandingScreen() {
    return (
        <LinearGradient
            colors={["#B3E0F2", "#FFFFFF"]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />


            {/* Radar Graphic Placeholder */}
            <View style={styles.imageContainer}>
                <Image
                    source={require("@/assets/images/hero1.png")}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>

            {/* Headline */}
            <Text style={styles.title}>Discover experiences <Text style={styles.you}>around you.</Text></Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Meet people who want to explore like you do.
                Safe, shared experiences — wherever you are.
            </Text>

            {/* CTA */}
            <TouchableOpacity onPress={() => router.push("/auth")} style={styles.ctaButton}>
                <Text style={styles.ctaText}>GET STARTED</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity>
                <Text onPress={() => router.push("/auth-pin-login")} style={styles.loginText}>
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
        justifyContent: "flex-start",
    },

    logoContainer: {
        position: "absolute",
        top: 88,          // safe under status bar
        left: 24,
        zIndex: 10,       // ensures it stays above background only
    },

    logoIcon: {
        color: "#B3E0F2",
        fontSize: 26,
        fontWeight: "900",
        marginRight: 6,
    },
    logoText: {
        color: "#99244D",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 1,
    },

    //    logoImage: {
    //         width: 140,
    //         height: 56,
    //         opacity: 0.92,
    //     },

    logoWrapper: {
        alignItems: "center",
        marginTop: 72,      // clears Dynamic Island
        marginBottom: 24,   // space before hero image
    },

    logoImage: {
        width: 160,
        height: 64,
    },


    title: {
        color: "#8B2F4B",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 18,
        marginTop: -55,//this could be adjusted based on image height
        letterSpacing: -0.2,
    },

    subtitle: {
        color: "#5A3F4A ",
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 36,
    },

    you: {
        color: "#E6A57E",
        fontFamily: "Marker Felt",
    },


    ctaButton: {
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#FFA05A",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },

    ctaText: {
        color: "#fcfcfc",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 1,
    },

    loginText: {
        color: "#9AA6B2",
        textAlign: "center",
        fontSize: 14,
    },

    loginLink: {
        color: "#E6A57E",
        fontWeight: "700",
    },

    imageContainer: {
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
    },

    heroImage: {
        width: 420,
        height: 420,
    },

});

