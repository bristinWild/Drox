import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens,
} from "@/constants/auth";
import { refreshToken as refreshApi } from "@/api/auth";
import { getMe } from "@/api/auth";
import { router } from "expo-router";


/* ---------------- TYPES ---------------- */

type AuthContextType = {
    accessToken: string | null;
    user: any | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<boolean>;
};

/* ---------------- CONTEXT ---------------- */

// IMPORTANT: undefined default, not {}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}): JSX.Element {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Bootstrap auth on app start
    useEffect(() => {
        (async () => {
            try {
                const token = await getAccessToken();
                if (!token) {
                    setLoading(false);
                    return;
                }

                setAccessToken(token);

                const me = await getMe(token);
                setUser(me);

                routeFromUser(me);
            } catch {
                await clearTokens();
                setAccessToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const routeFromUser = (me: any) => {
        if (!me.isActive) {
            router.replace("/auth");
        } else if (!me.isOnboarded) {
            router.replace("/onboarding");
        } else {
            router.replace("/(tabs)");
        }
    };

    const login = async (access: string, refresh: string) => {
        await saveTokens(access, refresh);
        setAccessToken(access);

        const me = await getMe(access);
        setUser(me);

        routeFromUser(me);
    };

    const logout = async () => {
        await clearTokens();
        setAccessToken(null);
    };

    const refresh = async (): Promise<boolean> => {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) return false;

        try {
            const res = await refreshApi(refreshToken);
            await saveTokens(res.accessToken, res.refreshToken);
            setAccessToken(res.accessToken);
            return true;
        } catch {
            await logout();
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                loading,
                login,
                logout,
                refresh,
            }
            }
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ---------------- HOOK ---------------- */

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}
