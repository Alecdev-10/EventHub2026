import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

export default function Invitations() {
    return (
        <div className="mx-auto max-w-5xl">
            <PageHeader title="Mes invitations" description="Les invitations seront affichées ici lorsqu’elles seront disponibles." />
            <Card>
                <EmptyState
                    icon={Mail}
                    title="Les invitations ne sont pas encore disponibles"
                    description="Aucune invitation n’est actuellement gérée par EventHub. Consultez les événements publiés pour vous inscrire."
                    action={<Link to="/user/events" className="inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong">Voir les événements</Link>}
                />
            </Card>
        </div>
    );
}
