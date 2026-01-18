import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from "react-native";



export default function OnboardingScreen() {
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [dob, setDob] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleContinue = async () => {
        if (!username.trim()) return;

        // TODO: send to backend
        // await updateProfile({ username, bio, dob, avatar })

        router.replace("/(tabs)");
    };

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
                    <Text style={styles.title}>Welcome to <Text style={styles.grid}>DROX.</Text></Text>
                    <Text style={styles.subtitle}>
                        Let others recognize you on the party.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>

                    {/* Avatar */}
                    <TouchableOpacity style={styles.avatarBox} onPress={pickImage}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        ) : (
                            <Text style={styles.avatarPlaceholder}>+</Text>
                        )}
                    </TouchableOpacity>

                    {/* Username */}
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#9AA6B2"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />

                    {/* Bio */}
                    <TextInput
                        placeholder="Short intro (optional)"
                        placeholderTextColor="#9AA6B2"
                        style={[styles.input, { height: 80 }]}
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />

                    {/* DOB */}
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowPicker(true)}
                    >
                        <Text style={{ color: dob ? "#2E2E2E" : "#9AA6B2" }}>
                            {dob
                                ? dob.toLocaleDateString()
                                : "Date of birth"}
                        </Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={dob || new Date(2000, 0, 1)}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            maximumDate={new Date()}
                            textColor="#2E2E2E"
                            onChange={(_, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) setDob(selectedDate);
                            }}
                        />
                    )}


                    {/* CTA */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            !username && { opacity: 0.4 },
                        ]}
                        onPress={handleContinue}
                        disabled={!username}
                    >
                        <Text style={styles.buttonText}>CONTINUE</Text>
                    </TouchableOpacity>

                    {/* Skip */}
                    <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
                        <Text style={styles.skip}>Skip for now</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 110,
    },
    title: {
        color: "#8B2F4B",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 6,
        letterSpacing: -0.2,
    },

    subtitle: {
        color: "#5A3F4A",
        fontSize: 14,
        marginBottom: 30,
        fontStyle: "italic",
    },

    avatarBox: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 1,
        borderColor: "#E6A57E",
        backgroundColor: "#FFFFFF",
        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        alignSelf: "center",
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },

    avatarPlaceholder: {
        color: "#E6A57E",
        fontSize: 36,
        fontWeight: "600",
    },

    input: {
        borderWidth: 1,
        borderColor: "#D6E3F0",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        color: "#2E2E2E",
        fontSize: 15,
        marginBottom: 16,
    },

    button: {
        backgroundColor: "#5674A6",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#5674A6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1,
    },


    skip: {
        color: "#E6A57E",
        textAlign: "center",
        marginTop: 20,
        fontWeight: "600",
    },

    backButton: {
        position: "absolute",
        top: 65,
        left: 20,
    },

    backArrow: {
        color: "#8B2F4B",
        fontSize: 26,
        fontWeight: "700",

    },

    grid: {
        color: "#E6A57E",
        fontFamily: "Marker Felt",
    },



});