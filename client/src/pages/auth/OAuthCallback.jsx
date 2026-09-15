import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
    const navigate   = useNavigate();
    const { setAccessToken, setCsrfToken } = useAuth();

    useEffect(() => {
        // Step 1 — read everything from the URL
        const params      = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        const csrfToken   = params.get("csrfToken");
        const next        = params.get("next") || "/home";

        if (accessToken && csrfToken) {
            // Step 2 — store tokens in React memory
            setAccessToken(accessToken);
            setCsrfToken(csrfToken);

            // Step 3 — clean the URL immediately
            // This removes ?accessToken=...&csrfToken=...&next=...
            // from the address bar WITHOUT reloading the page
            window.history.replaceState({}, "", "/auth/callback");

            // Step 4 — go to the right page
            navigate(next, { replace: true });
            // replace: true means /auth/callback won't appear
            // in browser back history — user can't press back to it

        } else {
            // No tokens in URL — something went wrong on the server
            navigate("/login?error=oauth_failed", { replace: true });
        }
    }, []);

    // This shows for a split second while the useEffect runs
    return (
        <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
            <p>Completing sign in...</p>
        </div>
    );
};

export default OAuthCallback;