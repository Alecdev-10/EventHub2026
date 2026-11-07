import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "./Logo";
import Button from "./ui/Button";

export default function Sidebar({ title, subtitle, navItems, onLogout, isOpen, onClose }) {
    const location = useLocation();
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const logoutDialog = useRef(null);

    useEffect(() => {
        const dialog = logoutDialog.current;
        if (!dialog) return;
        if (isLogoutOpen && !dialog.open) dialog.showModal();
        if (!isLogoutOpen && dialog.open) dialog.close();
    }, [isLogoutOpen]);

    const closeLogoutDialog = () => setIsLogoutOpen(false);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-ink/40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                aria-label={title}
                className={[
                    "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-base ease-standard md:static md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
            >
                <div className="border-b border-border px-5 py-6">
                    <Logo className="mb-2 text-brand" />
                    <p className="pl-1 text-xs font-medium tracking-wide text-ink-muted">{subtitle}</p>
                </div>

                <nav aria-label="Navigation principale" className="flex-1 overflow-y-auto p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                aria-current={isActive ? "page" : undefined}
                                className={[
                                    "mb-1 flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors duration-fast",
                                    isActive
                                        ? "bg-brand-subtle text-brand-strong"
                                        : "text-ink-muted hover:bg-surface-alt hover:text-ink",
                                ].join(" ")}
                            >
                                <Icon aria-hidden="true" className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-border p-4">
                    <button
                        onClick={() => setIsLogoutOpen(true)}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-danger transition-colors duration-fast hover:bg-danger/5"
                    >
                        <LogOut aria-hidden="true" className="h-5 w-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            <dialog
                ref={logoutDialog}
                onCancel={(event) => {
                    event.preventDefault();
                    closeLogoutDialog();
                }}
                onClose={closeLogoutDialog}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
                className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
            >
                <div className="p-6 sm:p-7">
                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-danger/10 text-danger">
                        <LogOut aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h2 id="logout-dialog-title" className="text-xl">Confirmer la déconnexion</h2>
                    <p id="logout-dialog-description" className="mt-2 text-sm leading-6 text-ink-muted">
                        Voulez-vous vraiment quitter votre espace EventHub ?
                    </p>
                    <div className="mt-7 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={closeLogoutDialog}>
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={async () => {
                                closeLogoutDialog();
                                await onLogout();
                            }}
                        >
                            Se déconnecter
                        </Button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
