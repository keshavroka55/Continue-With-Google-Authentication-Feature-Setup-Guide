import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import useLogout from "../hooks/useLogout";

export default function DashboardPage() {
    const { user } = useAuth();
    const handleLogout = useLogout();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#FF7A00]">AuthApp Dashboard</h1>
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
                        Dashboard 📊
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Welcome to the {user?.role === "admin" ? "Admin" : "Chef"} Dashboard.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="text-3xl font-bold text-[#FF7A00] mb-2">👤</div>
                            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                            <p className="text-gray-600 text-sm mt-1">{user?.name}</p>
                            <p className="text-gray-500 text-xs">{user?.email}</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="text-3xl font-bold text-blue-500 mb-2">🔑</div>
                            <h3 className="text-lg font-semibold text-gray-900">Role</h3>
                            <p className="text-gray-600 text-sm mt-1 capitalize">{user?.role?.replace("_", " ")}</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="text-3xl font-bold text-green-500 mb-2">✅</div>
                            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                            <p className="text-gray-600 text-sm mt-1">Authenticated</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="text-3xl font-bold text-purple-500 mb-2">🛡️</div>
                            <h3 className="text-lg font-semibold text-gray-900">Access</h3>
                            <p className="text-gray-600 text-sm mt-1">
                                {user?.role === "admin" ? "Full Access" : "Chef Access"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
