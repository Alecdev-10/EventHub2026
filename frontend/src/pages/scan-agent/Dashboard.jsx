import { useCallback, useEffect, useState } from "react";
import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle, QrCode, Ticket } from "lucide-react";
import { getEvents, getRecentCheckins } from "../../api/EventApi";
import { formatDate, formatTime } from "../../utils/format";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

export default function ScanAgentDashboard() {
    const [events, setEvents] = useState([]);
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const [assigned, scans] = await Promise.all([getEvents(), getRecentCheckins(1)]);
            setEvents(assigned.filter((event) => event.status === "published"));
            setActivity(scans);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    const todayValid = Number(activity?.today?.valid ?? 0);
    const tickets = events.reduce((sum, event) => sum + Number(event.activeRegistered ?? 0), 0);

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Vue d’ensemble" description="Suivez les événements qui vous sont affectés et vos contrôles d’accès." />

            {error ? (
                <Card><EmptyState title="Tableau de bord indisponible" description="Impossible de charger vos événements et vos scans depuis le serveur." action={<Button type="button" variant="outline" onClick={loadDashboard}>Réessayer</Button>} /></Card>
            ) : loading ? (
                <div role="status" className="rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Chargement de vos événements…</div>
            ) : (
                <>
                    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                            ["Événements actifs", events.length, CalendarDays, "bg-brand-subtle text-brand"],
                            ["Billets attendus", tickets, Ticket, "bg-warning/10 text-warning"],
                            ["Entrées validées par vous aujourd’hui", todayValid, CheckCircle, "bg-success/10 text-success"],
                        ].map(([label, value, Icon, tone]) => (
                            <Card key={label} className="p-4 sm:p-5">
                                <span className={["mb-5 grid h-10 w-10 place-items-center rounded-md", tone].join(" ")}>{createElement(Icon, { "aria-hidden": true, className: "h-5 w-5" })}</span>
                                <p className="text-sm text-ink-muted">{label}</p>
                                <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">{value}</p>
                            </Card>
                        ))}
                    </div>

                    <div className="mb-6 flex flex-col justify-between gap-5 rounded-lg bg-ink px-5 py-6 text-white sm:flex-row sm:items-center sm:px-7">
                        <div><p className="text-sm text-white/60">Le contrôle est prêt</p><h2 className="mt-1 text-2xl text-white">Vérifier un billet</h2></div>
                        <Link to="/scan-agent/scanner" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"><QrCode aria-hidden="true" className="h-5 w-5" />Ouvrir le scanner<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                    </div>

                    <Card className="overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
                            <div><p className="text-sm text-ink-muted">Affectations du back-office</p><h2 className="mt-1 text-xl">Mes événements</h2></div>
                            <Link to="/scan-agent/events" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-strong">Voir la liste<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                        </div>
                        {events.length === 0 ? (
                            <div className="p-5"><EmptyState title="Aucun événement affecté" description="Les événements qui vous seront confiés apparaîtront ici." /></div>
                        ) : (
                            <div className="divide-y divide-border">
                                {events.slice(0, 4).map((event) => {
                                    const scanned = Number(activity?.eventCounts?.[event.id]?.valid ?? 0);
                                    const started = new Date(event.startDate).getTime() <= Date.now();
                                    return (
                                        <div key={event.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand"><CalendarDays aria-hidden="true" className="h-5 w-5" /></span>
                                            <div className="min-w-0 flex-1"><h3 className="truncate text-base">{event.title}</h3><p className="mt-1 text-sm text-ink-muted">{formatDate(event.startDate)} · {formatTime(event.startDate)} · {event.location}</p></div>
                                            <div className="flex flex-wrap items-center gap-4"><div><p className="text-xs text-ink-muted">Entrées validées</p><p className="mt-1 text-sm font-semibold text-ink">{scanned} / {event.activeRegistered}</p></div><Badge tone={started ? "success" : "neutral"}>{started ? "En cours" : "À venir"}</Badge></div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
}
