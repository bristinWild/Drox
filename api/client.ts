import { useAuth } from "@/hooks/useAuth";

export function useApi() {
    const { accessToken, refresh, logout } = useAuth();

    const apiFetch = async (
        url: string,
        options: RequestInit = {},
        retried = false
    ): Promise<Response> => {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });


        if (res.status !== 401) {
            return res;
        }


        if (retried) {
            await logout();
            throw new Error("Session expired");
        }


        const ok = await refresh();
        if (!ok) {
            await logout();
            throw new Error("Session expired");
        }


        return apiFetch(url, options, true);
    };

    return { apiFetch };
}
