import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Home, Calendar, Mail, User, Ticket, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";

export default function UserLayout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { path: "/user", icon: Home, label: "Dashboard" },
        { path: "/user/events", icon: Calendar, label: "Événements" },
        { path: "/user/tickets", icon: Ticket, label: "Mes Billets" },
        { path: "/user/invitations", icon: Mail, label: "Invitations" },
        { path: "/user/profile", icon: User, label: "Profil" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/Login");
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar
                title="EventHub"
                subtitle="Espace Utilisateur"
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
                                <h2 className="text-gray-800 truncate">Bienvenue {user?.firstName ?? ""}</h2>
                                <p className="text-sm text-gray-500 truncate">Gérez vos événements facilement</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
                                <User className="w-5 h-5" />
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
