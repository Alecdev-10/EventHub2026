import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, BarChart3, QrCode, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { roleLabels } from "../utils/roles";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
    const navigate = useNavigate();
    const { role, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/events", icon: Calendar, label: "Gestion Événements" },
        { path: "/admin/guests", icon: Users, label: "Gestion Invités" },
        { path: "/admin/statistics", icon: BarChart3, label: "Statistiques" },
        { path: "/admin/scanner", icon: QrCode, label: "Scanner QR" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/Login");
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar
                title="EventHub"
                subtitle="Administration"
                navItems={navItems}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
                                aria-label="Ouvrir le menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="min-w-0">
                                <h2 className="text-gray-800">Panneau d'Administration</h2>
                                <p className="text-sm text-gray-500 truncate">Gérez tous vos événements et invités</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg whitespace-nowrap">
                                {roleLabels[role] ?? "Admin"}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
