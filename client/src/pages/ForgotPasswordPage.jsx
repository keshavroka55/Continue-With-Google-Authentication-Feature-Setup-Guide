
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Mail, ArrowLeft } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("If your email exists, you'll receive a password reset link shortly. Check your inbox!");
                setEmail("");
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Unable to process request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-2">Forgot Password?</h2>
                    <p className="text-center mb-8 text-gray-600">
                        Enter your email to receive a password reset link
                    </p>

                    {message && (
                        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF7A00] text-white py-3 rounded-xl font-medium hover:bg-[#ff8c1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 mt-6 text-[#FF7A00] hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
