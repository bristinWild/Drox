import { Modal, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { router } from "expo-router";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_TOP = 80;
const SNAP_MIDDLE = SCREEN_HEIGHT * 0.45;
const SNAP_BOTTOM = SCREEN_HEIGHT;

// ✅ Placeholder image
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80";

export default function ActivityJoinModal({ activity, onClose }: any) {
    const translateY = useSharedValue(SNAP_MIDDLE);
    const startY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            startY.value = translateY.value;
        })
        .onUpdate((e) => {
            const newY = startY.value + e.translationY;
            translateY.value = Math.max(
                SNAP_TOP,
                Math.min(newY, SNAP_MIDDLE)
            );
        })
        .onEnd((e) => {
            if (translateY.value < SCREEN_HEIGHT * 0.3) {
                translateY.value = withSpring(SNAP_TOP);
            } else {
                translateY.value = withSpring(SNAP_MIDDLE);
            }
        });

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Modal transparent animationType="none">
            <View style={styles.modalOverlay}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.modalCard, sheetStyle]}>
                        <View style={styles.dragHandle} />

                        {/* ✅ Always show placeholder image */}
                        <Image
                            source={{ uri: PLACEHOLDER_IMAGE }}
                            style={styles.modalImage}
                        />

                        <Text style={styles.modalTitle}>{activity.title}</Text>
                        <Text style={styles.modalDesc}>{activity.description || "No description"}</Text>

                        <View style={styles.statsRow}>
                            <Text style={styles.stat}>👥 {activity.people || 0} online</Text>
                            <Text style={styles.stat}>♂ {activity.male || 0}</Text>
                            <Text style={styles.stat}>♀ {activity.female || 0}</Text>
                        </View>

                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Joining fee</Text>
                            <Text style={styles.feeValue}>
                                {activity.isPaid ? `₹${activity.fee}` : "Free"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                                onClose();
                                router.push(`/chat/${activity.id}`);
                            }}
                        >
                            <Text style={styles.confirmText}>CONFIRM JOIN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </GestureDetector>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalImage: {
        width: "100%",
        height: 160,
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: "#E5E5E5",
    },

    modalTitle: {
        color: "#8B2F4B",
        fontSize: 20,
        fontWeight: "800",
    },

    modalDesc: {
        color: "#5A3F4A",
        marginTop: 8,
        marginBottom: 16,
        lineHeight: 20,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    stat: {
        color: "#7B8A99",
        fontSize: 13,
        fontWeight: "600",
    },

    feeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    feeLabel: {
        color: "#7B8A99",
        fontSize: 13,
    },

    feeValue: {
        color: "#2E2E2E",
        fontWeight: "700",
        fontSize: 15,
    },

    confirmButton: {
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: "#5674A6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },

    confirmText: {
        color: "#FFFFFF",
        fontWeight: "800",
        letterSpacing: 1,
    },

    cancelText: {
        color: "#E6A57E",
        textAlign: "center",
        marginTop: 16,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    modalCard: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: SCREEN_HEIGHT,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        shadowColor: "#5674A6",
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 10,
    },

    dragHandle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#D6E3F0",
        alignSelf: "center",
        marginBottom: 12,
    },
});