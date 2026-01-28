import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator,
    Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SearchBoxCore } from "@mapbox/search-js-core";
import { createActivity } from "@/api/activity";
import { getAccessToken } from "@/constants/auth";
import { uploadImageToCloudinary } from "@/utils/imageUpload";






const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 20 * 2;
const GAP = 12;
const SLOT_SIZE = (SCREEN_WIDTH - H_PADDING - GAP * 2) / 3;
const MAPBOX_TOKEN = "pk.eyJ1IjoiYnJpc3RpbiIsImEiOiJjbWt4MXd2Z2EwNHhxM2ZzM2RoY3hkdjhlIn0.GyT9MWfHu7OMEX4yEGa1vw";

const searchBox = new SearchBoxCore({
    accessToken: MAPBOX_TOKEN,
});



export default function CreateEventScreen() {
    const insets = useSafeAreaInsets();

    const [title, setTitle] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [locationResults, setLocationResults] = useState<any[]>([]);
    const [locationData, setLocationData] = useState<any>(null);

    const [description, setDescription] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [fee, setFee] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [sessionToken, setSessionToken] = useState(
        () => Math.random().toString(36).substring(2)
    );

    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");

    const searchLocation = async (query: string) => {
        setLocationQuery(query);

        if (query.length < 2) {
            setLocationResults([]);
            return;
        }

        try {
            const res = await searchBox.suggest(query, {
                sessionToken,
                limit: 5,
                country: "IN",
                types: "place,locality,neighborhood,address",
            });

            setLocationResults(res.suggestions || []);
        } catch (err) {
            console.log("Mapbox search error:", err);
            setLocationResults([]);
        }
    };



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


    const submit = async () => {
        console.log("Submitting with location:", locationData);

        // Validation
        if (!images.length) {
            alert("Please add at least one image");
            return;
        }

        if (!title.trim()) {
            alert("Please enter event name");
            return;
        }

        if (!locationData) {
            alert("Please select a location");
            return;
        }

        if (isPaid) {
            if (!fee || Number(fee) <= 0) {
                alert("Please enter a valid joining fee");
                return;
            }
        }

        try {
            setLoading(true);
            setUploadProgress("Preparing...");
            const accessToken = await getAccessToken();
            if (!accessToken) {
                alert("Please login again");
                router.replace("/auth");
                return;
            }

            // ✅ Upload images with detailed logging
            console.log("Starting image upload...");
            console.log("Number of images to upload:", images.length);
            setUploadProgress(`Creating memories...`);
            let uploadedImageUrls: string[] = [];

            try {
                // Upload images one by one to see which one fails
                for (let i = 0; i < images.length; i++) {
                    console.log(`Uploading image ${i + 1}/${images.length}...`);
                    console.log("Image URI:", images[i]);

                    const url = await uploadImageToCloudinary(images[i]);
                    uploadedImageUrls.push(url);

                    console.log(`Image ${i + 1} uploaded successfully:`, url);
                }

                console.log("All images uploaded successfully!");
                console.log("Uploaded URLs:", uploadedImageUrls);

            } catch (uploadError: any) {
                console.error("Image upload failed:", uploadError);
                console.error("Error message:", uploadError.message);
                console.error("Error stack:", uploadError.stack);

                alert(
                    `Failed to upload images: ${uploadError.message}`
                );
                return;
            }

            setUploadProgress("Creating activity...");

            // Build payload
            const payload = {
                title,
                location: locationData,
                description,
                isPaid,
                fee: isPaid ? Number(fee) : 0,
                payment: isPaid
                    ? {
                        flow: "DROX_ESCROW",
                        currency: "INR",
                    }
                    : null,
                images: uploadedImageUrls,
            };

            console.log("Sending payload to API:", payload);

            // Call API
            const response = await createActivity(accessToken, payload);

            console.log("Activity created successfully:", response);

            router.push('/(tabs)')


            alert(

                "Event created successfully!"
            );

        } catch (error: any) {
            console.error("Create activity error:", error);
            console.error("Error response:", error.response?.data);

            if (error.response?.status === 401) {
                alert("Session expired. Please login again");
                router.replace("/auth");
            } else {
                alert(
                    error.response?.data?.message || error.message || "Failed to create event"
                );
            }
        } finally {
            setLoading(false);
            setUploadProgress("");
        }


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
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#F5FAFE" }}
            contentContainerStyle={{
                paddingTop: insets.top + 16,
                paddingBottom: 10,
            }}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={120}
        >
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Event</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>
                </View>

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
                <Text style={styles.label}>Location</Text>

                <View style={{ zIndex: 100 }}>
                    <TextInput
                        value={locationQuery}
                        onChangeText={searchLocation}
                        placeholder="Place / City"
                        placeholderTextColor="#9AA6B2"
                        style={styles.input}
                    />

                    {locationResults.length > 0 && (
                        <View style={styles.dropdown}>
                            {locationResults.map((item) => (
                                <TouchableOpacity
                                    key={item.mapbox_id}
                                    style={styles.dropdownItem}
                                    onPress={async () => {
                                        try {
                                            // ✅ PASS THE FULL SUGGESTION OBJECT
                                            const res = await searchBox.retrieve(item, {
                                                sessionToken,
                                            });

                                            const feature = res.features?.[0];

                                            if (!feature || !feature.geometry) {
                                                alert("Unable to fetch location details");
                                                return;
                                            }

                                            const [lng, lat] = feature.geometry.coordinates;

                                            setLocationQuery(item.name);
                                            setLocationResults([]);

                                            setLocationData({
                                                name: item.name,
                                                address: item.place_formatted,
                                                lat,
                                                lng,
                                            });

                                            // 🔄 reset session for next search
                                            setSessionToken(Math.random().toString(36).substring(2));

                                            console.log("Selected location:", item.place_formatted, lat, lng);
                                        } catch (err) {
                                            console.log("Mapbox retrieve error:", err);
                                            console.log("Suggestion item:", item);

                                            alert("Failed to load location details");
                                        }
                                    }}

                                >
                                    <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, color: "#7B8A99" }}>
                                        {item.place_formatted}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* PAID / FREE */}
                <View style={styles.toggleRow}>
                    <Text style={styles.label}>Event Type</Text>
                    <View style={styles.toggleGroup}>
                        <Toggle active={!isPaid} onPress={() => setIsPaid(false)} text="Free" />
                        <Toggle active={isPaid} onPress={() => setIsPaid(true)} text="Paid" />
                    </View>
                </View>

                {/* FEE */}
                {isPaid && (
                    <>
                        <Input
                            label="Joining Fee (₹)"
                            value={fee}
                            onChange={setFee}
                            keyboardType="numeric"
                        />

                        <View style={styles.escrowBox}>
                            <Text style={styles.escrowTitle}>Payments via Drox Escrow</Text>
                            <Text style={styles.escrowText}>
                                All participant payments will be securely held by Drox.
                                The amount will be available to you inside the event group
                                during the activity.
                            </Text>
                        </View>
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
                <TouchableOpacity style={styles.submit} onPress={submit}>
                    <Text style={styles.submitText}>Create Activity</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={loading}
                transparent
                animationType="fade"
            >
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color="#5674A6" />
                        <Text style={styles.loadingText}>{uploadProgress}</Text>
                    </View>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
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
                placeholderTextColor="#9AA6B2"
                keyboardType={keyboardType}
                multiline={multiline}
                scrollEnabled={false}
                textAlignVertical="top"
                style={[styles.input, multiline && { height: 100 }]}
                returnKeyType="done"
                blurOnSubmit={true}
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
                active && { backgroundColor: "#5674A6", borderColor: "#5674A6", },
            ]}
        >
            <Text style={[styles.toggleText, active && { color: "#FFFFFF" }]}>
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
        color: "#8B2F4B",
        fontSize: 22,
        fontWeight: "800",
        fontFamily: "Marker Felt"
    },

    close: {
        color: "#E6A57E",
        fontWeight: "600",
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
        color: "#7B8A99",
        marginBottom: 6,
        fontSize: 13,
        fontWeight: "600",
        fontStyle: "italic",
    },


    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        color: "#2E2E2E",
        borderWidth: 1,
        borderColor: "#D6E3F0",
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
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D6E3F0",
        alignItems: "center",
    },

    toggleText: {
        color: "#7B8A99",
        fontWeight: "600",
    },

    submit: {
        marginTop: 24,
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: "#5674A6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },

    submitText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 16,
        letterSpacing: 1,
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
        color: "#E6A57E",
        fontSize: 32,
        fontWeight: "700",
    },

    imageSlot: {
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D6E3F0",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        shadowColor: "#5674A6",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,

    },


    escrowBox: {
        backgroundColor: "#F8FBFF",
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5EDF5",
    },


    escrowTitle: {
        color: "#8B2F4B",
        fontWeight: "700",
        marginBottom: 6,
    },


    escrowText: {
        color: "#5A3F4A",
        fontSize: 13,
        lineHeight: 18,
    },


    dropdown: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#E3EDF6",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },

    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },

    loadingOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingCard: {
        backgroundColor: "#FFFFFF",
        padding: 32,
        borderRadius: 20,
        alignItems: "center",
        minWidth: 200,
    },

    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: "600",
        color: "#5674A6",
        textAlign: "center",
    },


});

