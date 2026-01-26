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
    isUnlocked: boolean;
    unlockWithPin: () => void;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<boolean>;
    setUser: (user: any) => void;
    updateUserAndRoute: (user: any, unlocked?: boolean) => void;
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
    const [bootstrapped, setBootstrapped] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const unlockWithPin = () => {
        setIsUnlocked(true);
    };





    // Bootstrap auth on app start
    useEffect(() => {
        setIsUnlocked(false); // lock on cold start

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


    const routeFromUser = (me: any, unlocked = false) => {

        if (!me.isActive) {
            router.replace("/auth");
            return;
        }


        if (!me.hasPin) {
            router.replace("/auth-pin-setup");
            return;
        }

        if (me.hasPin && !unlocked) {
            router.replace("/auth-pin-login");
            return;
        }

        if (!me.isOnboarded) {
            router.replace("/onboarding");
            return;
        }

        router.replace("/(tabs)");
    };



    const login = async (access: string, refresh: string) => {
        await saveTokens(access, refresh);
        setAccessToken(access);

        const me = await getMe(access);
        setUser(me);

        unlockWithPin(); // visual / logical state only

        routeFromUser(me, true); // ✅ force-unlocked
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

    const updateUserAndRoute = (me: any, unlocked = false) => {
        setUser(me);
        routeFromUser(me, unlocked);
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                loading,
                isUnlocked,
                unlockWithPin,
                login,
                logout,
                refresh,
                setUser,
                updateUserAndRoute,
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
