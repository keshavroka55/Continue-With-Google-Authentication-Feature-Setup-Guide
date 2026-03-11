import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Users } from "lucide-react";
import Alert from "../components/Alert";
import { useAuth } from "../contexts/AuthContext";

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // If not logged in, redirect to login
    if (!user) {
        navigate("/login");
        return null;
    }

    const handleRoleSelection = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setError("Please select a role");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/update-role`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ role: selectedRole }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Failed to update role");
                return;
            }

            setSuccess("Role selected! Redirecting...");
            // The AuthContext will detect the role change and redirect automatically
            setTimeout(() => {
                navigate(selectedRole === "chef" ? "/dashboard" : "/home");
            }, 1000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        {
            id: "food_lover",
            title: "Food Lover",
            description: "Explore content, save favorites, and follow creators",
            icon: Users,
            color: "from-blue-500 to-cyan-500",
        },
        {
            id: "chef",
            title: "Chef",
            description: "Create and share your content with the community",
            icon: ChefHat,
            color: "from-orange-500 to-red-500",
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <div className="p-8 rounded-2xl shadow-2xl border bg-white/80 backdrop-blur-lg border-white/50">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-4">
                            <div className="bg-[#FF7A00] p-3 rounded-full">
                                <ChefHat className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome to AuthApp!
                        </h2>
                        <p className="text-gray-600">
                            Choose your role to get started
                        </p>
                    </div>

                    {/* Alerts */}
                    <Alert message={error} type="error" />
                    <Alert message={success} type="success" />

                    {/* Role Selection Form */}
                    <form onSubmit={handleRoleSelection} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {roles.map((role) => {
                                const IconComponent = role.icon;
                                const isSelected = selectedRole === role.id;

                                return (
                                    <motion.button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${isSelected
                                                ? "border-[#FF7A00] bg-[#FF7A00]/5"
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                            }`}
                                    >
                                        {/* Selected indicator */}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="selected-indicator"
                                                className="absolute top-3 right-3 w-6 h-6 bg-[#FF7A00] rounded-full flex items-center justify-center"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </motion.div>
                                        )}

                                        <div className="text-left">
                                            <div
                                                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
                                            >
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {role.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {role.description}
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!selectedRole || loading}
                            className="w-full h-12 bg-[#FF7A00] hover:bg-[#e66d00] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {loading ? "Setting up your account..." : "Continue as " + (selectedRole === "chef" ? "Chef" : "Food Lover")}
                        </button>
                    </form>

                    {/* Skip for now */}
                    <p className="text-center mt-6 text-sm text-gray-600">
                        You can change your role later in settings
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
