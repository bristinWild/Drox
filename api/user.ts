import { useApi } from "@/api/client";

const BASE_URL = "http://192.168.1.12:3000";

export function useUserApi() {
    const { apiFetch } = useApi();

    const getMe = async () => {
        const res = await apiFetch(`${BASE_URL}/auth/me`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
    };

    return { getMe };
}
