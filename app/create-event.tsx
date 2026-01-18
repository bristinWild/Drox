import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 20 * 2;
const GAP = 12;
const SLOT_SIZE = (SCREEN_WIDTH - H_PADDING - GAP * 2) / 3;


export default function CreateEventScreen() {
    const insets = useSafeAreaInsets();

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [fee, setFee] = useState("");
    const [images, setImages] = useState<string[]>([]);



    const pickImages = async () => {
        if (images.length >= 6) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const uris = result.assets.map(a => a.uri);
            setImages(prev => [...prev, ...uris].slice(0, 6));
        }
    };


    const submit = () => {
        if (!images.length) {
            alert("Please add at least one image");
            return;
        }

        if (!title.trim()) {
            alert("Please enter event name");
            return;
        }

        if (!location.trim()) {
            alert("Please enter location");
            return;
        }

        if (isPaid) {
            if (!fee || Number(fee) <= 0) {
                alert("Please enter a valid joining fee");
                return;
            }
        }


        const payload = {
            title,
            location,
            description,
            isPaid,
            fee: isPaid ? Number(fee) : 0,
            payment: isPaid
                ? {
                    flow: "DROX_ESCROW",
                    currency: "INR",
                }
                : null,
            images,
        };


        console.log("CREATE EVENT:", payload);
    };

    // const isCreateDisabled =
    //     !images.length ||
    //     !title.trim() ||
    //     !location.trim() ||
    //     (isPaid &&
    //         (!fee ||
    //             !paymentMethod ||
    //             (paymentMethod === "UPI" && !upiId.trim())));


    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#0B0F14" }}
            contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 40 }}
        >
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Events</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>
                </View>

                {/* IMAGE */}
                {/* IMAGES */}
                <Text style={styles.label}>Event Images/Banners</Text>

                <View style={styles.imageGrid}>
                    {images.map((uri, index) => (
                        <View key={uri} style={styles.imageSlot}>
                            <Image source={{ uri }} style={styles.image} />

                            <TouchableOpacity
                                style={styles.remove}
                                onPress={() =>
                                    setImages(prev => prev.filter((_, i) => i !== index))
                                }
                            >
                                <Text style={styles.removeText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {images.length < 6 && (
                        <TouchableOpacity style={styles.imageSlot} onPress={pickImages}>
                            <Text style={styles.addText}>＋</Text>
                        </TouchableOpacity>
                    )}
                </View>


                {/* ACTIVITY NAME */}
                <Input label="Event Name" value={title} onChange={setTitle} />

                {/* LOCATION */}
                <Input
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    placeholder="Place / City"
                />

                {/* PAID / FREE */}
                <View style={styles.toggleRow}>
                    <Text style={styles.label}>Event Type</Text>
                    <View style={styles.toggleGroup}>
                        <Toggle active={!isPaid} onPress={() => setIsPaid(false)} text="Free" />
                        <Toggle active={isPaid} onPress={() => setIsPaid(true)} text="Paid" />
                    </View>
                </View>
                {/* {isPaid && paymentMethod === "UPI" && (
                    <Input
                        label="UPI ID"
                        value={upiId}
                        onChange={setUpiId}
                        placeholder="name@bank"
                        autoCapitalize="none"
                    />
                )} */}

                {/* FEE */}
                {isPaid && (
                    <>
                        <Input
                            label="Joining Fee (₹)"
                            value={fee}
                            onChange={setFee}
                            keyboardType="numeric"
                        />
                        {isPaid && (
                            <View style={styles.escrowBox}>
                                <Text style={styles.escrowTitle}>Payments via Drox Escrow</Text>
                                <Text style={styles.escrowText}>
                                    All participant payments will be securely held by Drox.
                                    The amount will be available to you inside the event group
                                    during the activity.
                                </Text>
                            </View>
                        )}


                    </>
                )}




                {/* DESCRIPTION */}
                <Input
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    multiline
                />

                {/* SUBMIT */}
                <TouchableOpacity
                    style={styles.submit}
                    onPress={submit}
                >
                    <Text style={styles.submitText}>Create Activity</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}


function Input({
    label,
    value,
    onChange,
    placeholder,
    multiline,
    keyboardType,
}: any) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#6B7280"
                keyboardType={keyboardType}
                multiline={multiline}
                style={[styles.input, multiline && { height: 100 }]}
            />
        </View>
    );
}

function Toggle({ active, onPress, text }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.toggle,
                active && { backgroundColor: "#22D3EE" },
            ]}
        >
            <Text style={[styles.toggleText, active && { color: "#020617" }]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
    },
    close: {
        color: "#22D3EE",
    },
    imageBox: {
        height: 180,
        borderRadius: 16,
        backgroundColor: "#0F172A",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },

    imageText: {
        color: "#9CA3AF",
    },
    label: {
        color: "#9CA3AF",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#0F172A",
        borderRadius: 14,
        padding: 14,
        color: "#FFFFFF",
    },
    toggleRow: {
        marginBottom: 16,
    },
    toggleGroup: {
        flexDirection: "row",
        gap: 10,
    },
    toggle: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#0F172A",
        alignItems: "center",
    },
    toggleText: {
        color: "#9CA3AF",
        fontWeight: "600",
    },
    submit: {
        marginTop: 24,
        backgroundColor: "#22D3EE",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    submitText: {
        color: "#020617",
        fontWeight: "800",
        fontSize: 16,
    },

    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP,
        marginBottom: 24,
    },

    imageWrapper: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: 14,
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },

    remove: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 12,
        padding: 4,
    },

    removeText: {
        color: "#FFF",
        fontSize: 12,
    },

    addImage: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: 14,
        backgroundColor: "#0F172A",
        alignItems: "center",
        justifyContent: "center",
    },

    addText: {
        color: "#22D3EE",
        fontSize: 32,
        fontWeight: "700",
    },

    imageSlot: {
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        borderRadius: 14,
        backgroundColor: "#0F172A",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    escrowBox: {
        backgroundColor: "#0F172A",
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#22D3EE33",
    },

    escrowTitle: {
        color: "#22D3EE",
        fontWeight: "700",
        marginBottom: 6,
    },

    escrowText: {
        color: "#9CA3AF",
        fontSize: 13,
        lineHeight: 18,
    },


});

