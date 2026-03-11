import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Alert from "../components/Alert";
import { registerAPI } from "../services/authService";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("food_lover");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await registerAPI(name, email, password, role);

            if (!res.ok) {
                const data = await res.json();
                if (data.message?.includes("Email already registered")) {
                    setError("This email is already registered. Please sign in instead.");

                } else {
                    setError("Registration failed. Please try again.");
                }
                return;
            } else {
                setError(""); // clear any errors
                setSuccess("Account created successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            }

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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
                        Join AuthApp
                    </h2>
                    <p className="text-center mb-8 text-gray-600">
                        Create your account and get started
                    </p>

                    {/* Role Selector */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Register As:
                        </label>
                        <div className="flex gap-2">
                            {["food_lover", "chef"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-2 px-3 rounded-lg capitalize text-sm font-medium transition-all ${role === r
                                        ? "bg-[#FF7A00] text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {r.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    <Alert message={error} type="error" />
                    <Alert message={success} type="success" />

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Ram Khatri"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 h-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Ramkhatri@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 h-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
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
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 h-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#FF7A00] hover:bg-[#e66d00] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center">
                        <Link
                            to="/login"
                            className="text-[#FF7A00] hover:text-[#e66d00] font-semibold transition-colors"
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
