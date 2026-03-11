
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        setUser(null);
        navigate("/login");
    };

    // Auto-login on app load
    useEffect(() => {
        fetch("/api/auth/me", {
            credentials: "include", // cookies sent automatically
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(userData => {
                setUser(userData);
            })
            .catch(() => setUser(null))
            .finally(() => setAuthChecked(true));
    }, []);

    useEffect(() => {
        if (!authChecked) return;

        const prefixAuthOnlyRoutes = ["/dashboard"];

        // Returns true when the current path requires authentication
        const isAuthRequired = (pathname) =>
            prefixAuthOnlyRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

        // In the redirect effect:
        if (!user) {
            if (isAuthRequired(location.pathname)) navigate("/login");
            return; // guests stay on any other route freely
        }

        // If logged in and on auth pages, redirect by role.
        if (["/", "/login", "/register"].includes(location.pathname)) {
            if (user.role === "admin" || user.role === "chef") navigate("/dashboard");
            else navigate("/home");
        }
    }, [authChecked, user, location.pathname, navigate]);

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
