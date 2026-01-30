import { useApi } from "@/api/client";

const BASE_URL = "http://192.168.1.12:3000";

export function useUserApi() {
    const { apiFetch } = useApi();

    const getMe = async () => {
        const res = await apiFetch(`${BASE_URL}/user/me`);
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
    };

    const editProfile = async (data: {
        username?: string;
        bio?: string;
        avatarUrl?: string;
    }) => {
        const res = await apiFetch(`${BASE_URL}/user/edit-profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update profile");

        return res.json();
    };

    return {
        getMe,
        editProfile,
    };
}
