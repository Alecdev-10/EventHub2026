import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, QrCode, Calendar, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ScanAgentLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const navItems = [
        { path: "/scan-agent", icon: Home, label: "Dashboard" },
        { path: "/scan-agent/events", icon: Calendar, label: "Mes Événements" },
        { path: "/scan-agent/scanner", icon: QrCode, label: "Scanner" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/Login");
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-[#3B82F6]">EventFlow</h1>
                    <p className="text-sm text-gray-500 mt-1">Agent de Scan</p>
                </div>

                <nav className="flex-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                                    isActive
                                        ? "bg-[#3B82F6] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-gray-800">Agent de Contrôle</h2>
                            <p className="text-sm text-gray-500">Contrôle d'accès aux événements</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                                En service
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
