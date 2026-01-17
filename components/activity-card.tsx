import { TouchableOpacity, View, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function ActivityCard({ item, onJoin }: any) {
    return (

        <View style={styles.activityCard}>
            <View>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityMeta}>
                    {item.distance} • {item.people} joining
                </Text>
                <Text style={styles.activityTime}>{item.time}</Text>
            </View>

            <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
                <Text style={styles.joinText}>JOIN</Text>
            </TouchableOpacity>
        </View>


    );
}

const styles = StyleSheet.create({
    activityList: {
        gap: 12,
    },

    activityCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#1F2937",
    },

    activityTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    activityMeta: {
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 4,
    },

    activityTime: {
        color: "#22D3EE",
        fontSize: 12,
        marginTop: 6,
    },

    joinButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 14,
    },

    joinText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 12,
    },

})
