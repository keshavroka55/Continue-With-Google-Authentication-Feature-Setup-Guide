import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import SelectRolePage from "../pages/auth/SelectRolePage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth//ResetPasswordPage";
import OAuthCallback from "../pages/auth/OAuthCallback";
import HomePage from "../pages/home/HomePage";
import DashboardPage from "../pages/home/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute.jsx";


const AppRoute = () => {
    return (
        <>
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/select-role" element={<SelectRolePage />} />

                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/auth/callback" element={<OAuthCallback />} />

                    {/* Protected: food lovers and chefs */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute allowedRoles={["food_lover", "chef"]}>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected: admins and chefs */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin", "chef"]}>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </div>
        </>
    )
}

export default AppRoute;
