import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getUserHostedActivities, Activity } from "@/api/activity";
import { getAccessToken } from "@/constants/auth";



export default function MyActivitiesScreen() {
    const insets = useSafeAreaInsets();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchMyActivities();
    }, []);

    const fetchMyActivities = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();

            if (!token) {
                Alert.alert("Error", "Please login again");
                router.replace("/auth");
                return;
            }

            const data = await getUserHostedActivities(token);
            setActivities(data);
        } catch (error: any) {
            console.error("Failed to fetch activities:", error);
            if (error.response?.status === 401) {
                Alert.alert("Error", "Session expired. Please login again");
                router.replace("/auth");
            } else {
                Alert.alert("Error", "Failed to load your activities");
            }
        } finally {
            setLoading(false);
        }
    };


    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    return (
        <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
            {/* HEADER */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>My Hosted Activities</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* CONTENT */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5674A6" />
                    <Text style={styles.loadingText}>Loading your activities...</Text>
                </View>
            ) : activities.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>🎉</Text>
                    <Text style={styles.emptyTitle}>No Activities Yet</Text>
                    <Text style={styles.emptyText}>
                        Create your first activity and start connecting with people!
                    </Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.push("/create-event")}
                    >
                        <Text style={styles.createButtonText}>CREATE ACTIVITY</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.activityList}
                    showsVerticalScrollIndicator={false}
                >
                    {activities.map((activity) => {
                        const isFull =
                            typeof activity.maxParticipants === "number" &&
                            (activity.participantCount ?? 0) >= activity.maxParticipants;

                        return (
                            <View key={activity.id} style={styles.activityCard}>
                                {/* HEADER */}
                                <View style={styles.cardHeader}>
                                    <Text style={styles.activityTitle} numberOfLines={2}>
                                        {activity.title}
                                    </Text>
                                    <TouchableOpacity style={styles.menuButton}>
                                        <Text style={styles.menuIcon}>⋮</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* DESCRIPTION */}
                                <Text style={styles.activityDescription} numberOfLines={2}>
                                    {activity.description || "No description"}
                                </Text>

                                {/* LOCATION */}
                                <View style={styles.locationRow}>
                                    <Text style={styles.locationIcon}>📍</Text>
                                    <Text style={styles.locationText} numberOfLines={1}>
                                        {activity.location.name}
                                    </Text>
                                </View>

                                {/* FOOTER */}
                                <View style={styles.cardFooter}>
                                    <View style={styles.statsContainer}>
                                        <Text style={styles.statText}>
                                            👥 {activity.participantCount ?? 0}
                                            {activity.maxParticipants
                                                ? ` / ${activity.maxParticipants}`
                                                : ""}{" "}
                                            joined
                                        </Text>

                                        <Text style={styles.statText}>
                                            ♂ {activity.maleJoinedCount ?? 0}
                                        </Text>

                                        <Text style={styles.statText}>
                                            ♀ {activity.femaleJoinedCount ?? 0}
                                        </Text>

                                        <Text style={styles.statText}>•</Text>

                                        <Text style={styles.timeText}>
                                            {getTimeAgo(activity.createdAt)}
                                        </Text>
                                    </View>

                                    {/* FEE / FULL */}
                                    <View
                                        style={[
                                            styles.feeContainer,
                                            isFull && { backgroundColor: "#FEE2E2" },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.feeText,
                                                isFull && { color: "#B91C1C" },
                                            ]}
                                        >
                                            {isFull
                                                ? "FULL"
                                                : activity.isPaid
                                                    ? `₹${activity.fee}`
                                                    : "FREE"}
                                        </Text>
                                    </View>
                                </View>

                                {/* CTA */}
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => router.push(`/chat/${activity.id}`)}
                                >
                                    <Text style={styles.viewButtonText}>
                                        {isFull ? "VIEW CHAT" : "VIEW DETAILS"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            {/* FAB */}
            {!loading && activities.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push("/create-event")}
                >
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}
        </LinearGradient>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 16,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
    },

    backArrow: {
        color: "#8B2F4B",
        fontSize: 26,
        fontWeight: "700",
    },

    title: {
        color: "#8B2F4B",
        fontSize: 20,
        fontWeight: "800",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#7B8A99",
        fontSize: 14,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },

    emptyTitle: {
        color: "#8B2F4B",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },

    emptyText: {
        color: "#7B8A99",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
    },

    createButton: {
        backgroundColor: "#5674A6",
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 18,
        shadowColor: "#5674A6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },

    createButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 1,
    },

    scrollView: {
        flex: 1,
    },

    activityList: {
        padding: 20,
        gap: 16,
    },

    activityCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },

    activityTitle: {
        flex: 1,
        color: "#2E2E2E",
        fontSize: 18,
        fontWeight: "700",
        marginRight: 8,
    },

    menuButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },

    menuIcon: {
        color: "#7B8A99",
        fontSize: 20,
        fontWeight: "700",
    },

    activityDescription: {
        color: "#5A3F4A",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    locationIcon: {
        fontSize: 14,
        marginRight: 6,
    },

    locationText: {
        flex: 1,
        color: "#7B8A99",
        fontSize: 13,
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    statsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    statText: {
        color: "#7B8A99",
        fontSize: 12,
    },

    timeText: {
        color: "#E6A57E",
        fontSize: 12,
        fontWeight: "600",
    },

    feeContainer: {
        backgroundColor: "#F0F7FF",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },

    feeText: {
        color: "#5674A6",
        fontSize: 13,
        fontWeight: "700",
    },

    viewButton: {
        backgroundColor: "#5674A6",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    viewButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 0.5,
    },

    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#5674A6",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#5674A6",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    fabText: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "300",
    },
});