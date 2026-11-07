import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, QrCode, Calendar, LifeBuoy, Menu, HelpCircleIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/motion/PageTransition";
import Badge from "../components/ui/Badge";
import BrandFooter from "../components/ui/BrandFooter";
import { useToast } from "../contexts/ToastContext";

export default function ScanAgentLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { notify } = useToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { path: "/scan-agent", icon: Home, label: "Dashboard" },
        { path: "/scan-agent/events", icon: Calendar, label: "Mes Événements" },
        { path: "/scan-agent/scanner", icon: QrCode, label: "Scanner" },
        { path: "/contact", icon: HelpCircleIcon, label: "Aide & contact" },
    ];

    const handleLogout = async () => {
        await logout();
        notify({ tone: "info", title: "Déconnexion réussie", description: "Vous avez quitté votre espace." });
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-surface-alt">
            <Sidebar
                title="EventHub"
                subtitle="Agent de Scan"
                navItems={navItems}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="border-b border-border bg-surface px-4 py-4 md:px-8">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="-ml-2 rounded-md p-2 text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink md:hidden"
                                aria-label="Ouvrir le menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="min-w-0">
                                <h2 className="truncate text-lg">Agent de contrôle</h2>
                                <p className="truncate text-sm text-ink-muted">Contrôle d’accès aux événements</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge tone="success" className="whitespace-nowrap px-3 py-2">En service</Badge>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <PageTransition />
                    <BrandFooter className="mx-auto mt-10 max-w-7xl pb-2" />
                </main>
            </div>
        </div>
    );
}
