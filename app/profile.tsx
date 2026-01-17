import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Image } from "react-native";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
            </View>

            {/* USER INFO */}
            <View style={styles.userCard}>
                <Image
                    source={require("@/assets/images/cat-icon.png")}
                    style={styles.avatar}
                />
                <Text style={styles.name}>Bristin</Text>
                <Text style={styles.subtitle}>Solo Traveler</Text>
            </View>

            {/* ACTIONS */}
            <View style={styles.section}>
                <ProfileItem label="Edit Profile" />
                <ProfileItem label="Recent Activities" />
                <ProfileItem label="Settings" />
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

function ProfileItem({ label }: { label: string }) {
    return (
        <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{label}</Text>
        </TouchableOpacity>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0F14",
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
    },
    close: {
        color: "#22D3EE",
        fontSize: 14,
    },
    userCard: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1F2937",
        marginBottom: 12,
        overflow: "hidden",
    },
    name: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    subtitle: {
        color: "#9CA3AF",
        marginTop: 4,
    },
    section: {
        gap: 14,
    },
    item: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#0F172A",
        borderRadius: 14,
    },
    itemText: {
        color: "#FFFFFF",
        fontSize: 15,
    },
    logout: {
        marginTop: "auto",
        paddingVertical: 20,
        borderRadius: 14,
        backgroundColor: "#7F1D1D",
        alignItems: "center",
    },
    logoutText: {
        color: "#FCA5A5",
        fontWeight: "700",
    },
});

