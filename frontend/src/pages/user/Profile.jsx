import { createElement } from "react";
import { Mail, Phone, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { roleLabels } from "../../utils/roles";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

function ProfileField({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-md bg-surface-alt px-4 py-4">
            {createElement(icon, { "aria-hidden": true, className: "mt-0.5 h-4 w-4 shrink-0 text-brand" })}
            <div className="min-w-0">
                <p className="text-xs text-ink-muted">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-ink">{value}</p>
            </div>
        </div>
    );
}

export default function Profile() {
    const { user } = useAuth();
    const displayName = user ? [user.firstName, user.name].join(" ") : "—";

    return (
        <div className="mx-auto max-w-4xl">
            <PageHeader
                title="Mon profil"
                description="Consultez les informations associées à votre compte."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.75fr_1.25fr]">
                <Card className="h-fit p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-brand-subtle text-brand">
                            <UserRound aria-hidden="true" className="h-9 w-9" />
                        </div>
                        <h2 className="text-xl">{displayName}</h2>
                        <p className="mt-1 text-sm text-ink-muted">
                            {roleLabels[user?.role] ?? "Utilisateur"}
                        </p>
                    </div>
                </Card>

                <div className="grid content-start gap-5">
                    <Card className="p-5 sm:p-6">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-ink-muted">Vos coordonnées</p>
                                <h2 className="mt-1 text-xl">Informations personnelles</h2>
                            </div>
                        </div>
                        <div className="grid gap-2.5">
                            <ProfileField icon={UserRound} label="Nom complet" value={displayName} />
                            <ProfileField icon={Mail} label="Adresse e-mail" value={user?.email ?? "—"} />
                            <ProfileField icon={Phone} label="Téléphone" value={user?.telephone ?? "—"} />
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
