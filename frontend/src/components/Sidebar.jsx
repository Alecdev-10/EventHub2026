import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Sidebar({ title, subtitle, navItems, onLogout, isOpen, onClose }) {
    const location = useLocation();

    return (
        <>
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:static md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-[#3B82F6]">{title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
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
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
