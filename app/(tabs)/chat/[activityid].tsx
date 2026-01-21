import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { router } from "expo-router";

const MOCK_MESSAGES = [
    { id: "1", user: "Aarav", text: "Anyone reached already?" },
    { id: "2", user: "Meera", text: "I’ll be there in 10 mins" },
];

export default function ActivityChatScreen() {
    const { activityId } = useLocalSearchParams();
    // const [message, setMessage] = useState("");
    type ChatMessage = {
        id: string;
        user: string;
        text: string;
    };

    // const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(MOCK_MESSAGES);


    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            user: "You",
            text: message,
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };


    return (
        <LinearGradient colors={["#B3E0F2", "#FFFFFF"]} style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.push(`/chat/${activityId}/info`)}
                    >
                        <Text style={styles.subtitle}>View info</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Group Chat</Text>
                    <Text style={styles.activitySub}>typing...{activityId}</Text>

                </View>



                {/* CHAT */}
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatList}
                    renderItem={({ item }) => (
                        <View style={styles.messageBubble}>
                            <Text style={styles.username}>{item.user}</Text>
                            <Text style={styles.message}>{item.text}</Text>
                        </View>
                    )}
                />

                {/* INPUT */}
                <View style={styles.inputBar}>
                    <TextInput
                        placeholder="Type a message…"
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient >
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderColor: "#D6E3F0",
    },

    title: {
        color: "#8B2F4B",
        fontWeight: "800",
        fontSize: 18,
        letterSpacing: -0.2,
        fontFamily: "Marker Felt",
        // color: "#5674A6",
    },

    chatText: {
        color: "#E6A57E",
        fontFamily: "Marker Felt",
    },

    subtitle: {
        fontSize: 12,
        color: "#E6A57E",
        marginTop: 4,
        left: 280,
        top: 25
    },

    chatList: {
        padding: 20,
        gap: 12,
    },

    messageBubble: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        shadowColor: "#5674A6",
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },

    username: {
        fontSize: 12,
        fontWeight: "700",
        color: "#8B2F4B",
        marginBottom: 4,
    },

    message: {
        fontSize: 14,
        color: "#2E2E2E",
    },

    inputBar: {
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderColor: "#D6E3F0",
        backgroundColor: "#FFFFFF",
    },

    input: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    sendBtn: {
        marginLeft: 10,
        backgroundColor: "#5674A6",
        borderRadius: 14,
        paddingHorizontal: 18,
        justifyContent: "center",
    },

    sendText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    activitySub: {
        fontSize: 12,
        color: "#7B8A99",
        marginTop: 4,
    }
});
