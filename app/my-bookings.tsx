import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getMyBookings } from "@/api/participation";
import { getActivityById } from "@/api/activity";

export default function MyBookingsScreen() {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const bookings = await getMyBookings();

                const enriched = await Promise.all(
                    bookings.map(async (b: any) => {
                        try {
                            const activity = await getActivityById(b.activityId);
                            return {
                                ...b,
                                activity,
                            };
                        } catch {
                            return null;
                        }
                    })
                );

                if (mounted) {
                    setBookings(enriched.filter(Boolean));
                }
            } catch (err) {
                console.error("Failed to load bookings", err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);


    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>My Bookings</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#5674A6" style={{ marginTop: 40 }} />
            ) : bookings.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>You haven’t joined any activities yet</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.list}>
                    {bookings.map((b) => (
                        <TouchableOpacity
                            key={b.id}
                            style={styles.card}
                            onPress={() => router.push(`/chat/${b.activity.id}`)}
                        >
                            {/* IMAGE */}
                            {b.activity.images?.[0] && (
                                <Image
                                    source={{ uri: b.activity.images[0] }}
                                    style={styles.image}
                                />
                            )}

                            {/* CONTENT */}
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.title}>{b.activity.title}</Text>

                                <Text style={styles.meta}>
                                    📍 {b.activity.location.name}
                                </Text>

                                <View style={styles.countRow}>
                                    <Text style={styles.meta}>
                                        👥 {b.activity.participantCount} joined
                                    </Text>

                                    <Text style={styles.countText}>
                                        ♂ {b.activity.maleJoinedCount ?? 0}
                                    </Text>
                                    <Text style={styles.countText}>
                                        ♀ {b.activity.femaleJoinedCount ?? 0}
                                    </Text>

                                </View>


                                <Text style={styles.meta}>
                                    💰 {b.activity.isPaid ? `₹${b.activity.fee}` : "Free"}
                                </Text>

                                <Text style={styles.joinedAt}>
                                    Joined on {new Date(b.joinedAt).toLocaleDateString()}
                                </Text>

                                <View style={styles.cta}>
                                    <Text style={styles.ctaText}>OPEN CHAT</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FAFE",
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    close: {
        color: "#E6A57E",
        fontSize: 14,
        fontWeight: "600",
    },

    list: {
        gap: 14,
        paddingBottom: 24,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#5674A6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },

    activityId: {
        fontSize: 12,
        color: "#7B8A99",
        marginBottom: 4,
    },

    activityValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2E2E2E",
        marginBottom: 6,
    },


    empty: {
        alignItems: "center",
        marginTop: 60,
    },

    emptyText: {
        color: "#9AA6B2",
        fontSize: 16,
    },

    image: {
        width: "100%",
        height: 160,
        borderRadius: 14,
        backgroundColor: "#E5EDF5",
    },

    title: {
        fontSize: 16,
        fontWeight: "800",
        color: "#2E2E2E",
        marginBottom: 6,
    },

    meta: {
        fontSize: 13,
        color: "#7B8A99",
        marginBottom: 4,
    },

    joinedAt: {
        fontSize: 12,
        color: "#9AA6B2",
        marginTop: 6,
    },

    cta: {
        marginTop: 12,
        backgroundColor: "#5674A6",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    ctaText: {
        color: "#FFFFFF",
        fontWeight: "800",
        letterSpacing: 0.6,
    },

    countRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 6,
        marginBottom: 6,
    },

    countText: {
        fontSize: 13,
        color: "#7B8A99",
        fontWeight: "600",
    },


});
