import { Modal, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, ScrollView, ActivityIndicator, Alert } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { joinActivity, checkJoiningStatus } from "@/api/participation";


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_TOP = 80;
const SNAP_MIDDLE = SCREEN_HEIGHT * 0.45;
const SNAP_BOTTOM = SCREEN_HEIGHT;
const IMAGE_HEIGHT = 220;
const AUTO_SLIDE_INTERVAL = 3000;



const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80";

export default function ActivityJoinModal({ activity, onClose }: any) {
    const translateY = useSharedValue(SNAP_MIDDLE);
    const startY = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [joining, setJoining] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);


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

    const images =
        Array.isArray(activity?.images) && activity.images.length > 0
            ? activity.images
            : [PLACEHOLDER_IMAGE];


    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, [currentIndex, images.length]);


    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await checkJoiningStatus(activity.id);
                if (mounted) setHasJoined(res.hasJoined);
            } finally {
                if (mounted) setCheckingStatus(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [activity.id]);



    return (
        <>
            {/* MAIN BOTTOM SHEET MODAL */}
            <Modal transparent animationType="none">
                <View style={styles.modalOverlay}>
                    <GestureDetector gesture={panGesture}>
                        <Animated.View style={[styles.modalCard, sheetStyle]}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.modalContent}
                            >
                                <View style={styles.dragHandle} />

                                <View style={styles.carouselContainer}>
                                    <FlatList
                                        ref={flatListRef}
                                        data={images}
                                        keyExtractor={(_, index) => index.toString()}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        onMomentumScrollEnd={(e) => {
                                            const index = Math.round(
                                                e.nativeEvent.contentOffset.x /
                                                (Dimensions.get("window").width - 40)
                                            );
                                            setCurrentIndex(index);
                                        }}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                activeOpacity={0.9}
                                                onPress={() => {
                                                    setViewerIndex(index);
                                                    setIsImageViewerOpen(true);
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: item }}
                                                    style={styles.modalImage}
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>

                                <View style={styles.dotsRow}>
                                    {images.map((_, index: number) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                index === currentIndex && styles.activeDot,
                                            ]}
                                        />
                                    ))}
                                </View>

                                <Text style={styles.modalTitle}>{activity.title}</Text>
                                <Text style={styles.modalDesc}>
                                    {activity.description || "No description"}
                                </Text>

                                <View style={styles.statsRow}>
                                    <Text style={styles.stat}>
                                        👥 {activity.participantCount ?? 0} joined
                                    </Text>
                                    <Text style={styles.stat}>
                                        ♂ {activity.maleJoinedCount ?? 0}
                                    </Text>
                                    <Text style={styles.stat}>
                                        ♀ {activity.femaleJoinedCount ?? 0}
                                    </Text>
                                </View>

                                <View style={styles.feeRow}>
                                    <Text style={styles.feeLabel}>Joining fee</Text>
                                    <Text style={styles.feeValue}>
                                        {activity.isPaid ? `₹${activity.fee}` : "Free"}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        (joining || checkingStatus) && { opacity: 0.6 },
                                    ]}
                                    disabled={joining || checkingStatus}
                                    onPress={async () => {
                                        // ✅ If already joined → just open chat
                                        if (hasJoined) {
                                            onClose();
                                            router.push(`/chat/${activity.id}`);
                                            return;
                                        }

                                        // ✅ Otherwise → join activity
                                        try {
                                            setJoining(true);
                                            await joinActivity(activity.id);
                                            onClose();
                                            router.push(`/chat/${activity.id}`);
                                        } catch (err: any) {
                                            const message =
                                                err.response?.data?.message ||
                                                err.message ||
                                                "Unable to join activity";

                                            Alert.alert("Join failed", message);
                                        } finally {
                                            setJoining(false);
                                        }
                                    }}
                                >
                                    {joining || checkingStatus ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.confirmText}>
                                            {hasJoined ? "OPEN CHAT" : "CONFIRM JOIN"}
                                        </Text>
                                    )}
                                </TouchableOpacity>




                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </Animated.View>
                    </GestureDetector>
                </View>
            </Modal>

            {/* FULLSCREEN IMAGE VIEWER */}
            {isImageViewerOpen && (
                <Modal
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsImageViewerOpen(false)}
                >
                    <View style={styles.viewerOverlay}>
                        <FlatList
                            data={images}
                            horizontal
                            pagingEnabled
                            initialScrollIndex={viewerIndex}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, index) => index.toString()}
                            getItemLayout={(_, index) => ({
                                length: Dimensions.get("window").width,
                                offset: Dimensions.get("window").width * index,
                                index,
                            })}
                            renderItem={({ item }) => (
                                <View style={styles.viewerImageWrapper}>
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.viewerImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.viewerClose}
                            onPress={() => setIsImageViewerOpen(false)}
                        >
                            <Text style={styles.viewerCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </>
    );



}



const styles = StyleSheet.create({
    modalImage: {
        width: Dimensions.get("window").width - 40,
        height: IMAGE_HEIGHT,
        borderRadius: 16,
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

    dotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#D6D6D6",
        marginHorizontal: 4,
    },

    activeDot: {
        backgroundColor: "#5674A6",
    },

    modalContent: {
        paddingBottom: 40,
    },

    carouselContainer: {
        height: IMAGE_HEIGHT,
        marginBottom: 12,
    },

    viewerOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.95)",
    },

    viewerImageWrapper: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "center",
        alignItems: "center",
    },

    viewerImage: {
        width: "100%",
        height: "100%",
    },

    viewerClose: {
        position: "absolute",
        top: 50,
        right: 24,
        backgroundColor: "rgba(0,0,0,0.6)",
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    viewerCloseText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },


});