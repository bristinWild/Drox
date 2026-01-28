import { TouchableOpacity, View, Text } from "react-native";
import { StyleSheet } from "react-native";

interface ActivityCardProps {
    item: {
        id: string;
        title: string;
        description: string;
        location: {
            name: string;
            address: string;
        };
        isPaid: boolean;
        fee: string;
        images: string[];
        distance?: string;
        people?: number;
        createdAt: string;
    };
    onJoin: () => void;
}

export default function ActivityCard({ item, onJoin }: ActivityCardProps) {
    // Calculate time ago
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    // ✅ Truncate title to max 30 characters
    const truncateTitle = (title: string, maxLength: number = 30) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength).trim() + '...';
    };

    return (
        <View style={styles.activityCard}>
            <View style={styles.contentContainer}>
                <Text style={styles.activityTitle}>
                    {truncateTitle(item.title)}
                </Text>
                <Text style={styles.activityMeta}>
                    {item.distance || 'N/A'} • {item.people || 0} joining
                </Text>
                <Text style={styles.activityTime}>
                    {getTimeAgo(item.createdAt)}
                </Text>
            </View>

            <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
                <Text style={styles.joinText}>JOIN</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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

    contentContainer: {
        flex: 1,
        marginRight: 12,
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
});