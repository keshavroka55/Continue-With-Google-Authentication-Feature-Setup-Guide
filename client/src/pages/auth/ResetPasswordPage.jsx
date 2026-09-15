
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Lock, Eye, EyeOff } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Unable to process request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                        <ChefHat className="w-16 h-16 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
                    <p className="text-gray-600">Redirecting to login page...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="p-8 rounded-2xl shadow-2xl border bg-white/80 backdrop-blur-lg border-white/50">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#FF7A00] p-3 rounded-full">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
                    <p className="text-center mb-8 text-gray-600">
                        Enter your new password below
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00]"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00]"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full bg-[#FF7A00] text-white py-3 rounded-xl font-medium hover:bg-[#ff8c1a] transition-colors disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <Link
                        to="/login"
                        className="block text-center mt-6 text-[#FF7A00] hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
