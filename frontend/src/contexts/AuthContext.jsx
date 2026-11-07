import { createContext, useContext, useState } from "react";
import * as AuthApi from "../api/AuthApi";

const AuthContext = createContext(null);

function readStoredUser() {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    return storedUser && storedToken ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);

    const persistSession = ({ user, token }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const login = async (credentials) => {
        const { data } = await AuthApi.login(credentials);
        if (data.backoffice_login_url) {
            return {
                role: data.role,
                backofficeLoginUrl: data.backoffice_login_url,
            };
        }
        persistSession(data);
        return { role: data.user.role };
    };

    const register = async (payload) => {
        const { data } = await AuthApi.register(payload);
        persistSession(data);
        return data.user.role;
    };

    const logout = async () => {
        try {
            await AuthApi.logout();
        } catch {
            // best-effort: on déconnecte localement même si l'appel réseau échoue
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = {
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
}
