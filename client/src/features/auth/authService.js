const BASE = "/api/auth";

// Register
export const registerAPI = async (name, email, password, role) => {
    const res = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    return res;
};

// Login
export const loginAPI = async (email, password) => {
    const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    return res;
};


// Logout
export const logoutAPI = async () => {
    const res = await fetch(`${BASE}/logout`, {
        method: "POST",
        credentials: "include",
    });
    return res;
};
