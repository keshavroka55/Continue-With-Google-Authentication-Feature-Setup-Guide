import { useAuth } from "../contexts/AuthContext";
import { logoutAPI } from "../services/authService";

export default function useLogout() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logoutAPI();
        logout();
    };

    return handleLogout;
}
