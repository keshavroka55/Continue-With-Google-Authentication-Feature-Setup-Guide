import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff, Mail, Lock } from "lucide-react";
import Alert from "../components/Alert";
import { loginAPI } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";



export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const { setUser } = useAuth();
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginAPI(email, password);

            if (!res.ok) {
                setError("Invalid credentials. Please try again.");
                return;
            }

            const data = await res.json();
            setUser(data.user);
            setSuccess("Login successful! Redirecting based on your role...");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/api/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="p-8 rounded-2xl shadow-2xl border bg-white/80 backdrop-blur-lg border-white/50">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-[#FF7A00] p-3 rounded-full">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="text-center mb-8 text-gray-600">
                        Sign in to continue to AuthApp
                    </p>

                    {/* Auto Role Detection Info */}
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                            ℹ️ Your role is automatically detected from your account.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <Alert message={error} type="error" />
                    <Alert message={success} type="success" />

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700 block mb-2"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 h-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700 block mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 h-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-[#FF7A00] hover:underline text-right block mt-2"
                        >
                            Forgot password?
                        </Link>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#FF7A00] hover:bg-[#e66d00] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span className="font-medium text-gray-700">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                New here?
                            </span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <p className="text-center">
                        <Link
                            to="/register"
                            className="text-[#FF7A00] hover:text-[#e66d00] font-semibold transition-colors"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
