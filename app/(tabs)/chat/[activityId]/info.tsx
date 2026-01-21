import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useEffect } from "react";

type MediaItem = {
    id: string;
    uri: string;
    type: "image" | "video" | "file";
    uploadedBy: string;
    createdAt: string;
};



export default function GroupInfoScreen() {

    const params = useLocalSearchParams();
    const activityId =
        typeof params.activityId === "string"
            ? params.activityId
            : params.activityId?.[0];


    const [groupName, setGroupName] = useState("Mountain Trek");
    const [description, setDescription] = useState(
        "Early morning trek with fellow solo travelers."
    );

    const [groupImage, setGroupImage] = useState<any>(
        require("@/assets/images/hiking.png")
    );

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);

    const isPaid = true;


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setGroupImage({ uri: result.assets[0].uri });
        }
    };

    useEffect(() => {
        mediaData.forEach(item => {
            Image.prefetch(item.uri);
        });
    }, []);

    function Stat({ label, value }: { label: string; value: string }) {
        return (
            <View style={styles.stat}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Feather name="arrow-left" size={22} color="#111827" />
                    </TouchableOpacity>
                    <View style={styles.avatarWrapper}>
                        <Image source={groupImage} style={styles.avatar} />

                        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                            <Feather name="edit-2" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* TITLE */}
                    <View style={styles.editRow}>
                        {isEditingTitle ? (
                            <TextInput
                                value={groupName}
                                onChangeText={setGroupName}
                                style={styles.groupNameInput}
                                autoFocus
                                onBlur={() => setIsEditingTitle(false)}
                            />
                        ) : (
                            <Text style={styles.groupName}>{groupName}</Text>
                        )}

                        <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                            <Feather name="edit-2" size={18} color="#5674A6" />
                        </TouchableOpacity>
                    </View>

                    {/* BADGE */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {isPaid ? "Paid Group" : "Free Group"}
                        </Text>
                    </View>
                </View>

                {/* STATS */}
                <View style={styles.card}>
                    <FlatList
                        data={mediaData}
                        numColumns={3}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.mediaGrid}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/(tabs)/chat/[activityId]/media",
                                        params: {
                                            activityId,
                                            startIndex: index.toString(),
                                        },
                                    })
                                }
                            >
                                <Image
                                    source={item.uri}
                                    style={styles.mediaItem}
                                    contentFit="cover"
                                    transition={200}
                                    cachePolicy="disk"
                                />
                            </TouchableOpacity>
                        )}

                    />
                </View>


                {/* MEDIA GRID */}
                {/* <View style={styles.card}>
                    <FlatList
                        data={[
                            require("@/assets/images/hiking.png"),
                            require("@/assets/images/cafe.png"),
                            require("@/assets/images/beer-mug.png"),
                        ]}
                        numColumns={3}
                        keyExtractor={(_, i) => i.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={styles.mediaGrid}
                        renderItem={({ item }) => (
                            <Image source={item} style={styles.mediaItem} />
                        )}
                    />
                </View> */}

                {/* DESCRIPTION */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Group Description</Text>

                        <TouchableOpacity onPress={() => setIsEditingDesc(true)}>
                            <Feather name="edit-2" size={16} color="#5674A6" />
                        </TouchableOpacity>
                    </View>

                    {isEditingDesc ? (
                        <TextInput
                            multiline
                            value={description}
                            onChangeText={setDescription}
                            style={styles.descriptionInput}
                            autoFocus
                            onBlur={() => setIsEditingDesc(false)}
                        />
                    ) : (
                        <Text style={styles.descriptionText}>{description}</Text>
                    )}
                </View>

                {/* MEMBERS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Group Members</Text>

                    {[
                        { name: "Aarav", role: "Host" },
                        { name: "Meera", role: "Member" },
                        { name: "Rohan", role: "Member" },
                    ].map((member, idx) => (
                        <View key={idx} style={styles.memberRow}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text
                                style={[
                                    styles.memberRole,
                                    member.role === "Host" && styles.hostRole,
                                ]}
                            >
                                {member.role}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* INVITE LINK */}
                <View style={styles.linkContainer}>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Copy invite link</Text>
                    </TouchableOpacity>
                </View>

                {/* LEAVE GROUP */}
                <View style={styles.leaveContainer}>
                    <TouchableOpacity style={styles.leaveButton}>
                        <Text style={styles.leaveText}>Leave Group</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
        backgroundColor: "#F8FAFC",
    },

    header: {
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 24,
    },

    avatarWrapper: {
        position: "relative",
        marginBottom: 12,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    editIcon: {
        position: "absolute",
        bottom: -2,
        right: -2,
        backgroundColor: "#5674A6",
        padding: 6,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },

    editRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },

    groupName: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
    },

    groupNameInput: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        borderBottomWidth: 1,
        borderColor: "#CBD5E1",
        minWidth: 200,
        textAlign: "center",
    },

    badge: {
        marginTop: 10,
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
    },

    badgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#92400E",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    stat: {
        alignItems: "center",
    },

    statValue: {
        fontSize: 16,
        fontWeight: "800",
        color: "#111827",
    },

    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },

    mediaGrid: {
        padding: 4,
    },

    mediaItem: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: 12,
        margin: "1.5%",
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
    },

    descriptionText: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
    },

    descriptionInput: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
    },

    memberRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#F1F5F9",
    },

    memberName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    memberRole: {
        fontSize: 13,
        color: "#6B7280",
    },

    hostRole: {
        color: "#8B2F4B",
        fontWeight: "700",
    },

    linkContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
    },

    linkButton: {
        backgroundColor: "#6366F1",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },

    linkText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    leaveContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },

    leaveButton: {
        backgroundColor: "#FEE2E2",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },

    leaveText: {
        color: "#B91C1C",
        fontSize: 15,
        fontWeight: "700",
    },

    backBtn: {
        position: "absolute",
        top: 68,            // adjusts for status bar
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.9)",
        zIndex: 100,
    },

});


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
