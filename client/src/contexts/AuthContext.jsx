
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [csrfToken, setCsrfToken] = useState(() => {
        // Restore CSRF token from sessionStorage on mount
        return sessionStorage.getItem("csrfToken") || null;
    });
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Persist CSRF token to sessionStorage whenever it changes
    useEffect(() => {
        if (csrfToken) {
            sessionStorage.setItem("csrfToken", csrfToken);
        } else {
            sessionStorage.removeItem("csrfToken");
        }
    }, [csrfToken]);

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setCsrfToken(null);
        sessionStorage.removeItem("csrfToken");
        navigate("/login");
    };

    // Auto-login on app load
    // Try to get current user: prefer in-memory access token, otherwise rely
    // on refresh token + csrf (handled by /refresh-token).
    useEffect(() => {
        const fetchMe = async () => {
            setAuthChecked(false);
            try {
                const headers = {};
                if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    headers,
                });

                if (res.ok) {
                    const body = await res.json();
                    setUser(body.user);
                    setAuthChecked(true);
                    return;
                }

                // If /me fails, try to refresh using csrfToken + HttpOnly refresh cookie.
                if (csrfToken) {
                    const refreshRes = await fetch("/api/auth/refresh-token", {
                        method: "POST",
                        credentials: "include",
                        headers: { "x-csrf-token": csrfToken },
                    });

                    if (refreshRes.ok) {
                        const body = await refreshRes.json();
                        setAccessToken(body.accessToken);
                        setCsrfToken(body.csrfToken);
                        // Try /me again with new access token
                        const retry = await fetch("/api/auth/me", {
                            method: "GET",
                            credentials: "include",
                            headers: { "Authorization": `Bearer ${body.accessToken}` },
                        });
                        if (retry.ok) {
                            const rbody = await retry.json();
                            setUser(rbody.user);
                            setAuthChecked(true);
                            return;
                        }
                    }
                }

                setUser(null);
            } catch (err) {
                setUser(null);
            } finally {
                setAuthChecked(true);
            }
        };

        fetchMe();
    }, [accessToken, csrfToken]);

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
        <AuthContext.Provider value={{ user, setUser, logout, accessToken, setAccessToken, csrfToken, setCsrfToken, authChecked }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
