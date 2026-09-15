import { useAuth } from "../contexts/AuthContext";
import { logoutAPI } from "../features/auth/authService";

export default function useLogout() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logoutAPI();
        logout();
    };

    return handleLogout;
}
