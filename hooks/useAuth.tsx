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

/* ---------------- TYPES ---------------- */

type AuthContextType = {
    accessToken: string | null;
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
    const [loading, setLoading] = useState(true);

    // Bootstrap auth on app start
    useEffect(() => {
        (async () => {
            const token = await getAccessToken();
            setAccessToken(token);
            setLoading(false);
        })();
    }, []);

    const login = async (access: string, refresh: string) => {
        await saveTokens(access, refresh);
        setAccessToken(access);
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
      value= {{
        accessToken,
            loading,
            login,
            logout,
            refresh,
      }
}
    >
    { children }
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
