import { View, FlatList, Dimensions, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import ImageViewing from "react-native-image-viewing";
import { useState } from "react";


const { width, height } = Dimensions.get("window");

type MediaItem = {
    id: string;
    uri: string;
    type: "image" | "video" | "file";
    uploadedBy: string;
    createdAt: string;
};

export default function GroupMediaScreen() {

    const [viewerVisible, setViewerVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color="#111827" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Media</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* MEDIA GRID */}
            <FlatList
                data={mediaData}
                numColumns={3}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 8 }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setActiveIndex(index);
                            setViewerVisible(true);
                        }}
                    >
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.mediaItem}
                            contentFit="cover"
                        />
                    </TouchableOpacity>
                )}

            />
            <ImageViewing
                images={mediaData.map((m) => ({ uri: m.uri }))}
                imageIndex={activeIndex}
                visible={viewerVisible}
                onRequestClose={() => setViewerVisible(false)}
            />
        </View>
    );
}


const mediaData: MediaItem[] = [
    {
        id: "1",
        uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        type: "image",
        uploadedBy: "Aarav",
        createdAt: "2026-01-20",
    },
    {
        id: "2",
        uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        type: "image",
        uploadedBy: "Meera",
        createdAt: "2026-01-19",
    },
];


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
    },

    mediaItem: {
        width: width / 3 - 12,
        height: width / 3 - 12,
        borderRadius: 12,
        margin: 4,
    },

});
