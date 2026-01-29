import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Image } from "react-native";
import { useUserApi } from "@/api/user";
import { getAccessToken } from "@/constants/auth";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";



export default function ProfileScreen() {

    interface User {
        id: string;
        name: string | null;
        bio: string | null;
        avatarUrl: string | null;
        email: string | null;
        phone: string | null;
    }
    const insets = useSafeAreaInsets();

    const { logout } = useAuth();
    const { getMe } = useUserApi();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editAvatar, setEditAvatar] = useState<string | null>(null);

    const handlePickImage = async () => {
        if (!isEditing) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setEditAvatar(result.assets[0].uri);
        }
    };

    const handleSaveProfile = async () => {
        try {
            // later: call PATCH /user/profile or onboarding update
            setUser((prev) =>
                prev
                    ? {
                        ...prev,
                        name: editName,
                        bio: editBio,
                        avatarUrl: editAvatar,
                    }
                    : prev
            );

            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save profile", err);
        }
    };



    useEffect(() => {
        const loadUser = async () => {
            try {
                const me = await getMe();
                setUser(me);
            } catch (err) {
                console.error("Failed to load user", err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            setEditName(user.name || "");
            setEditBio(user.bio || "");
            setEditAvatar(user.avatarUrl || null);
        }
    }, [user]);


    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <Text style={{ color: "#7B8A99" }}>Loading profile…</Text>
            </View>
        );
    }

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
                <View style={styles.userCard}>
                    <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.editIconText}>
                            {isEditing ? "Editing" : "Edit"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handlePickImage}
                        disabled={!isEditing}
                        style={styles.avatarWrapper}
                    >
                        <Image
                            source={
                                editAvatar
                                    ? { uri: editAvatar }
                                    : require("@/assets/images/cat-icon.png")
                            }
                            style={styles.avatar}
                        />
                        {isEditing && (
                            <View style={styles.avatarOverlay}>
                                <Text style={styles.avatarEditText}>📷</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {isEditing ? (
                        <>
                            <View style={styles.fieldCard}>
                                <TextInput
                                    value={editName}
                                    onChangeText={setEditName}
                                    style={styles.fieldInput}
                                    placeholder="Your name"
                                    placeholderTextColor="#9AA6B2"
                                />
                            </View>

                            <View style={styles.fieldCard}>
                                <TextInput
                                    value={editBio}
                                    onChangeText={setEditBio}
                                    style={[styles.fieldInput, styles.fieldBio]}
                                    placeholder="Tell something about yourself"
                                    placeholderTextColor="#9AA6B2"
                                    multiline
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.name}>{user?.name || "Anonymous"}</Text>
                            <Text style={styles.subtitle}>
                                {user?.bio || "No bio added yet"}
                            </Text>
                        </>
                    )}
                </View>
                {isEditing && (


                    <View style={styles.editActions}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => {
                                setIsEditing(false);
                                setEditName(user?.name || "");
                                setEditBio(user?.bio || "");
                                setEditAvatar(user?.avatarUrl || null);
                            }}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSaveProfile}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                )}


                {/* ACTIONS */}
                <View style={styles.section}>
                    <ProfileItem label="Messages" />
                    <ProfileItem label="Create Event" onPress={() => router.push("/create-event")} />
                    <ProfileItem label="My Hostings" onPress={() => router.push("/my-activities")} />
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

    editIcon: {
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
    },

    editIconText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#5674A6",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "#EEF3FA",
        opacity: 0.9,
    },

    input: {
        width: "100%",
        backgroundColor: "#F8FBFF",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#2E2E2E",
        borderWidth: 1,
        borderColor: "#E3ECF5",
    },

    bioInput: {
        minHeight: 60,
        textAlignVertical: "top",
    },

    editActions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },

    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
    },

    saveBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: "#5674A6",
        alignItems: "center",
    },

    saveText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    cancelText: {
        color: "#374151",
        fontWeight: "600",
        fontSize: 15,
    },

    editHint: {
        fontSize: 13,
        color: "#7B8A99",
        marginBottom: 12,
    },

    avatarWrapper: {
        position: "relative",
        marginBottom: 16,
    },

    avatarOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12
    },

    avatarEditText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 0.3,
        bottom: 1,
        left: 3
    },

    inputLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#7B8A99",
        marginBottom: 6,
        marginTop: 12,
    },

    fieldCard: {
        width: "100%",
        backgroundColor: "#F5FAFE",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 14,
        shadowColor: "#5674A6",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },

    fieldInput: {
        fontSize: 16,
        color: "#2E2E2E",
        fontWeight: "500",
    },

    fieldBio: {
        minHeight: 60,
        textAlignVertical: "top",
    },



});