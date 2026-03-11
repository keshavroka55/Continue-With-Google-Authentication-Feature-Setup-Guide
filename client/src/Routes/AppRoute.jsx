import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SelectRolePage from "../pages/SelectRolePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";


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
