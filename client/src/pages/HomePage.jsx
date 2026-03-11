import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import useLogout from "../hooks/useLogout";

export default function HomePage() {
    const { user } = useAuth();
    const handleLogout = useLogout();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#FF7A00]">AuthApp</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Welcome, <span className="font-semibold">{user?.name}</span>
                        </span>
                        <span className="px-3 py-1 bg-[#FF7A00]/10 text-[#FF7A00] rounded-full text-sm font-medium capitalize">
                            {user?.role?.replace("_", " ")}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome Home! 🎉
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        You are logged in as a <span className="font-semibold capitalize text-[#FF7A00]">{user?.role?.replace("_", " ")}</span>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">👤 Profile</h3>
                            <p className="text-gray-600 text-sm">Name: {user?.name}</p>
                            <p className="text-gray-600 text-sm">Email: {user?.email}</p>
                            <p className="text-gray-600 text-sm capitalize">Role: {user?.role?.replace("_", " ")}</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Authentication</h3>
                            <p className="text-gray-600 text-sm">JWT-based session</p>
                            <p className="text-gray-600 text-sm">HTTP-only cookies</p>
                            <p className="text-gray-600 text-sm">Role-based access</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Features</h3>
                            <p className="text-gray-600 text-sm">Google OAuth</p>
                            <p className="text-gray-600 text-sm">Password Reset</p>
                            <p className="text-gray-600 text-sm">Role Selection</p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
