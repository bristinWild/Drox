// constants/activities.ts

export type Activity = {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    accent: string;
};

export const ACTIVITIES: Activity[] = [
    {
        id: "cafe",
        title: "Visit Cafe",
        subtitle: "Coffee • Conversations",
        icon: "☕",
        accent: "#22D3EE",
    },
    {
        id: "bars",
        title: "Hop Bars",
        subtitle: "Drinks • Night vibes",
        icon: "🍸",
        accent: "#A855F7",
    },
    {
        id: "parks",
        title: "Visit Parks",
        subtitle: "Nature • Relax",
        icon: "🌳",
        accent: "#22C55E",
    },
    {
        id: "jogging",
        title: "Jogging Group",
        subtitle: "Fitness • Community",
        icon: "🏃‍♂️",
        accent: "#F97316",
    },
];
