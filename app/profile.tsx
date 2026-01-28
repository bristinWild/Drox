import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Image } from "react-native";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();

    const { logout } = useAuth();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* HEADER - Keep outside ScrollView so it stays fixed */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
            </View>

            {/* ✅ Wrap content in ScrollView */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
                showsVerticalScrollIndicator={false}
            >
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
                    <ProfileItem label="Messages" />
                    <ProfileItem label="Create Event" onPress={() => router.push("/create-event")} />
                    <ProfileItem label="Hosted Activities" onPress={() => router.push("/my-activities")} />
                    <ProfileItem label="My Bookings" />
                    <ProfileItem label="Edit Profile" />
                    <ProfileItem label="Recent Activities" />
                    <ProfileItem label="Settings" />
                </View>

                {/* LOGOUT */}
                <TouchableOpacity
                    style={styles.logout}
                    onPress={() => {
                        logout();
                        router.replace("/");
                    }}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

function ProfileItem({
    label,
    onPress,
}: {
    label: string;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <Text style={styles.itemText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FAFE",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        paddingHorizontal: 20,
    },

    title: {
        color: "#8B2F4B",
        fontSize: 22,
        fontWeight: "800",
        fontFamily: "Marker Felt",
    },

    close: {
        color: "#E6A57E",
        fontSize: 14,
        fontWeight: "600",
    },

    // ✅ New styles for ScrollView
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
    },

    userCard: {
        alignItems: "center",
        marginBottom: 32,
        paddingVertical: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 4,
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E5EDF5",
        marginBottom: 12,
        overflow: "hidden",
    },

    name: {
        color: "#2E2E2E",
        fontSize: 18,
        fontWeight: "700",
    },

    subtitle: {
        color: "#7B8A99",
        marginTop: 4,
        fontSize: 13,
        fontStyle: "italic",
    },

    section: {
        gap: 14,
        marginBottom: 24, // ✅ Add space before logout button
    },

    item: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        shadowColor: "#5674A6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },

    itemText: {
        color: "#2E2E2E",
        fontSize: 15,
        fontWeight: "600",
    },

    logout: {
        paddingVertical: 18,
        borderRadius: 16,
        backgroundColor: "#FFF1F2",
        alignItems: "center",
        marginBottom: 20,
    },

    logoutText: {
        color: "#B91C1C",
        fontWeight: "700",
    },
});