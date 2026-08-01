import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Mail, User, LogOut, Ticket } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function UserLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

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
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-[#3B82F6]">EventFlow</h1>
                    <p className="text-sm text-gray-500 mt-1">Espace Utilisateur</p>
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
                            <h2 className="text-gray-800">Bienvenue {user?.firstName ?? ""}</h2>
                            <p className="text-sm text-gray-500">Gérez vos événements facilement</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white">
                                <User className="w-5 h-5" />
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
