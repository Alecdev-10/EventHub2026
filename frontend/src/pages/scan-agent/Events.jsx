import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, QrCode, Users } from "lucide-react";
import { getEvents, getRecentCheckins } from "../../api/EventApi";
import { formatDate, formatTime, eventStatusLabels } from "../../utils/format";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

export default function ScanAgentEvents() {
    const [events, setEvents] = useState([]);
    const [eventCounts, setEventCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadEvents = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const [assigned, scans] = await Promise.all([getEvents(), getRecentCheckins(1)]);
            setEvents(assigned);
            setEventCounts(scans.eventCounts ?? {});
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Mes événements" description="Les événements dont vous assurez le contrôle d’accès." />
            {loading ? (
                <div role="status" className="rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Chargement des affectations…</div>
            ) : error ? (
                <Card><EmptyState title="Événements indisponibles" description="Impossible de récupérer vos affectations." action={<Button type="button" variant="outline" onClick={loadEvents}>Réessayer</Button>} /></Card>
            ) : events.length === 0 ? (
                <Card><EmptyState title="Aucun événement affecté" description="Les événements qui vous seront confiés apparaîtront ici." /></Card>
            ) : (
                <div className="grid gap-4">
                    {events.map((event) => {
                        const counts = eventCounts[event.id] ?? {};
                        const scanned = Number(counts.valid ?? 0);
                        const expected = Number(event.activeRegistered ?? 0);
                        const pending = Math.max(0, expected - scanned);
                        const attendance = expected > 0 ? Math.min(100, Math.round((scanned / expected) * 100)) : 0;
                        const canScan = event.status === "published";

                        return (
                            <Card key={event.id} className="p-5 sm:p-6">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand"><CalendarDays aria-hidden="true" className="h-6 w-6" /></span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl">{event.title}</h2><Badge tone={event.status === "published" ? "success" : "neutral"}>{eventStatusLabels[event.status] ?? event.status}</Badge></div>
                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
                                            <p className="flex items-center gap-2"><Clock3 aria-hidden="true" className="h-4 w-4 text-brand" />{formatDate(event.startDate)} · {formatTime(event.startDate)}</p>
                                            <p className="flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4 text-brand" />{event.location}</p>
                                            <p className="flex items-center gap-2"><Users aria-hidden="true" className="h-4 w-4 text-brand" />{expected} participants attendus</p>
                                        </div>
                                        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                                            {[["Entrées validées", scanned, "text-success", "bg-success/5"], ["Billets restants", pending, "text-warning", "bg-warning/5"], ["Présence", `${attendance}%`, "text-brand", "bg-brand-subtle/60"]].map(([label, value, tone, background]) => <div key={label} className={["rounded-md px-3 py-3 text-center", background].join(" ")}><p className="text-xs text-ink-muted">{label}</p><p className={["mt-1 text-xl font-semibold", tone].join(" ")}>{value}</p></div>)}
                                        </div>
                                    </div>
                                    {canScan && <Link to="/scan-agent/scanner" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong lg:mt-1"><QrCode aria-hidden="true" className="h-4 w-4" />Scanner les billets</Link>}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
