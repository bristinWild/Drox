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

        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,

        shadowColor: "#5674A6",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },

    activityTitle: {
        color: "#2E2E2E",
        fontSize: 16,
        fontWeight: "700",
    },

    activityMeta: {
        color: "#7B8A99",
        fontSize: 12,
        marginTop: 4,
    },

    activityTime: {
        color: "#E6A57E",
        fontSize: 12,
        marginTop: 6,
        fontWeight: "600",
    },

    joinButton: {
        backgroundColor: "#5674A6",
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 16,
    },


    joinText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 13,
        letterSpacing: 0.5,
    },


})
