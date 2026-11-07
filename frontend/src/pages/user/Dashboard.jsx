import { useCallback, useEffect, useState } from "react";
import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle, Ticket } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { getEvents, getMyTickets } from "../../api/EventApi";
import { formatDate, formatTime, ticketStatusLabels } from "../../utils/format";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

export default function UserDashboard() {
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const [eventData, ticketData] = await Promise.all([getEvents(), getMyTickets()]);
            setEvents(eventData);
            setTickets(ticketData);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    const now = Date.now();
    const upcomingEvents = events.filter((event) => event.status === "published" && new Date(event.startDate).getTime() > now).slice(0, 3);
    const activeTickets = tickets.filter((ticket) => ["confirmed", "checkedIn"].includes(ticket.status));

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader title="Mon espace" description="Retrouvez vos événements et vos inscriptions au même endroit." action={<Link to="/user/events" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-brand px-4 py-2.5 text-sm font-semibold text-brand transition-colors duration-fast hover:bg-brand-subtle">Explorer les événements<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>} />

            {error ? (
                <Card><EmptyState title="Votre espace est indisponible" description="Impossible de charger vos événements et billets depuis le serveur." action={<Button type="button" variant="outline" onClick={loadDashboard}>Réessayer</Button>} /></Card>
            ) : loading ? (
                <div role="status" className="rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Chargement de votre espace…</div>
            ) : (
                <>
                    <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[["Événements à venir", events.filter((event) => event.status === "published" && new Date(event.startDate).getTime() > now).length, CalendarDays, "bg-brand-subtle text-brand"], ["Mes billets", tickets.length, Ticket, "bg-warning/10 text-warning"], ["Inscriptions actives", activeTickets.length, CheckCircle, "bg-success/10 text-success"]].map(([label, value, Icon, tone]) => <Card key={label} className="p-5 sm:p-6"><span className={["mb-6 grid h-11 w-11 place-items-center rounded-md", tone].join(" ")}>{createElement(Icon, { "aria-hidden": true, className: "h-5 w-5" })}</span><p className="text-sm font-medium text-ink-muted">{label}</p><p className="mt-1 text-4xl font-semibold tracking-tight text-ink">{value}</p></Card>)}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
                        <Card className="overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-7"><div><p className="text-sm font-semibold text-brand">À votre agenda</p><h2 className="mt-2 text-xl">Événements à venir</h2></div><Link to="/user/events" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-strong">Tout voir<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
                            {upcomingEvents.length === 0 ? <div className="p-5"><EmptyState title="Aucun événement à venir" description="Les prochains événements publiés par votre entreprise apparaîtront ici." /></div> : (
                                <div className="divide-y divide-border">
                                    {upcomingEvents.map((event) => <Link key={event.id} to={`/user/events/${event.id}`} className="group flex flex-col gap-4 p-5 transition-colors duration-fast hover:bg-surface-alt sm:flex-row sm:items-center sm:p-6"><ImageWithFallback src={event.image} alt={event.title} className="h-36 w-full rounded-md object-cover sm:h-20 sm:w-24" /><div className="min-w-0 flex-1"><h3 className="truncate text-base">{event.title}</h3><p className="mt-2 text-sm text-ink-muted">{formatDate(event.startDate)} · {formatTime(event.startDate)} · {event.location}</p></div><span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">Détails<ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}
                                </div>
                            )}
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6"><div><p className="text-sm font-semibold text-brand">Votre activité</p><h2 className="mt-2 text-xl">Inscriptions récentes</h2></div><Ticket aria-hidden="true" className="h-5 w-5 text-brand" /></div>
                            {tickets.length === 0 ? <div className="p-5"><EmptyState title="Aucune inscription" description="Vos billets apparaîtront ici après votre inscription à un événement." /></div> : (
                                <div className="divide-y divide-border">{tickets.slice(0, 4).map((ticket) => <Link key={ticket.id} to={`/user/tickets/${ticket.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-alt sm:px-6"><div className="min-w-0"><h3 className="truncate text-sm font-medium">{ticket.event?.title ?? "Événement"}</h3><p className="mt-1 text-xs text-ink-muted">{ticket.event?.startDate ? formatDate(ticket.event.startDate) : ""}</p></div><Badge tone={ticket.status === "confirmed" ? "success" : "neutral"}>{ticketStatusLabels[ticket.status] ?? ticket.status}</Badge></Link>)}</div>
                            )}
                            <div className="border-t border-border p-5 sm:px-6"><Link to="/user/tickets" className="flex min-h-11 w-full items-center justify-between text-sm font-semibold text-brand hover:text-brand-strong">Tous mes billets<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
