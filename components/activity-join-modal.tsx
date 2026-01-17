import { Modal, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_TOP = 80;
const SNAP_MIDDLE = SCREEN_HEIGHT * 0.45;
const SNAP_BOTTOM = SCREEN_HEIGHT;


export default function ActivityJoinModal({ activity, onClose }: any) {
    const translateY = useSharedValue(SNAP_MIDDLE);
    const startY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            startY.value = translateY.value;
        })
        .onUpdate((e) => {
            translateY.value = Math.max(
                SNAP_TOP,
                startY.value + e.translationY
            );
        })
        .onEnd((e) => {
            if (e.velocityY > 1200 && translateY.value > SCREEN_HEIGHT * 0.6) {
                translateY.value = withSpring(
                    SNAP_BOTTOM,
                    { damping: 20 },
                    () => {
                        runOnJS(onClose)();
                    }
                );
                return;
            }

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
                        <Image source={activity.image} style={styles.modalImage} />

                        <Text style={styles.modalTitle}>{activity.title}</Text>
                        <Text style={styles.modalDesc}>{activity.description}</Text>

                        <View style={styles.statsRow}>
                            <Text style={styles.stat}>👥 {activity.online} online</Text>
                            <Text style={styles.stat}>♂ {activity.male}</Text>
                            <Text style={styles.stat}>♀ {activity.female}</Text>
                        </View>

                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Joining fee</Text>
                            <Text style={styles.feeValue}>{activity.joiningFee}</Text>
                        </View>

                        <TouchableOpacity style={styles.confirmButton}>
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
    },

    modalTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
    },

    modalDesc: {
        color: "#9CA3AF",
        marginTop: 8,
        marginBottom: 16,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    stat: {
        color: "#22D3EE",
        fontSize: 13,
    },

    feeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    feeLabel: {
        color: "#9CA3AF",
    },

    feeValue: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    confirmButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
    },

    confirmText: {
        color: "#FFFFFF",
        fontWeight: "800",
    },

    cancelText: {
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 14,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
    },

    modalCard: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: SCREEN_HEIGHT,
        backgroundColor: "#0B0F14",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
    },

    dragHandle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#374151",
        alignSelf: "center",
        marginBottom: 12,
    },

});

