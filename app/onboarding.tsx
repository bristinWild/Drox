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
                <LinearGradient colors={["#0B0F14", "#121826"]} style={styles.container}>
                    <Text style={styles.title}>Welcome to DROX</Text>
                    <Text style={styles.subtitle}>
                        Let others recognize you on the grid.
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
                        placeholderTextColor="#6B7280"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />

                    {/* Bio */}
                    <TextInput
                        placeholder="Short intro (optional)"
                        placeholderTextColor="#6B7280"
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
                        <Text style={{ color: dob ? "#FFFFFF" : "#6B7280" }}>
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
        paddingTop: 90,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 6,
    },
    subtitle: {
        color: "#9CA3AF",
        fontSize: 14,
        marginBottom: 30,
    },
    avatarBox: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 1,
        borderColor: "#22D3EE",
        alignSelf: "center",
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
        color: "#22D3EE",
        fontSize: 36,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#22D3EE",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#FFFFFF",
        fontSize: 15,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#D9F50A",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#0B0F14",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1,
    },
    skip: {
        color: "#22D3EE",
        textAlign: "center",
        marginTop: 20,
    },

    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },


    backArrow: {
        color: "#FFFFFF",
        fontSize: 26,
    },

});