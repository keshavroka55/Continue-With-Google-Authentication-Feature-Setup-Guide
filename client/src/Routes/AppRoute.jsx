import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import SelectRolePage from "../pages/auth/SelectRolePage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth//ResetPasswordPage";
import HomePage from "../pages/home/HomePage";
import DashboardPage from "../pages/home/DashboardPage";


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

                    <Route path="/home" element={<HomePage />} />

                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </div>
        </>
    )
}

export default AppRoute;
