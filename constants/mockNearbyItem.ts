export type NearbyItem = {
    id: string;
    type: "user" | "activity";
    title: string;
    latitude: number;
    longitude: number;
};

export function generateNearby(
    lat: number,
    lng: number
): NearbyItem[] {
    const offset = () => (Math.random() - 0.5) * 0.01;

    return [
        {
            id: "u1",
            type: "user",
            title: "Alex nearby",
            latitude: lat + offset(),
            longitude: lng + offset(),
        },
        {
            id: "u2",
            type: "user",
            title: "Sam nearby",
            latitude: lat + offset(),
            longitude: lng + offset(),
        },
        {
            id: "a1",
            type: "activity",
            title: "Coffee & Chat",
            latitude: lat + offset(),
            longitude: lng + offset(),
        },
        {
            id: "a2",
            type: "activity",
            title: "Game Night",
            latitude: lat + offset(),
            longitude: lng + offset(),
        },
    ];
}
