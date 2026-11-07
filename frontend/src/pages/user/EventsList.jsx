import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { getEvents, getMyTickets, registerForEvent } from "../../api/EventApi";
import { useToast } from "../../contexts/ToastContext";
import { formatDate, formatPrice, eventStatusLabels } from "../../utils/format";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";

function isRegistered(tickets, eventId) {
    return tickets.some((ticket) => Number(ticket.eventId) === Number(eventId)
        && ["confirmed", "checkedIn"].includes(ticket.status));
}

function getRegistrationError(error) {
    const code = error.response?.data?.code;
    if (code === "payment_required") return "Cet événement est payant. L’inscription en ligne sera disponible après l’intégration du paiement.";
    if (code === "registration_closed") return "Les inscriptions sont fermées car l’événement a commencé ou est terminé.";
    if (code === "event_unavailable") return "Les inscriptions ne sont pas ouvertes pour cet événement.";
    if (error.response?.status === 409) return "Vous êtes déjà inscrit à cet événement.";
    if (error.response?.status === 422) {
        const message = String(error.response.data?.message ?? "").toLowerCase();
        return message.includes("full") || message.includes("complet")
            ? "Cet événement affiche complet."
            : error.response.data?.message ?? "L’inscription n’a pas pu aboutir.";
    }
    if (!error.response) return "Le serveur est injoignable. Vérifiez votre connexion puis réessayez.";
    return "L’inscription n’a pas pu aboutir. Réessayez dans quelques instants.";
}

export default function EventsList() {
    const { notify } = useToast();
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pendingEventId, setPendingEventId] = useState(null);

    const loadEvents = useCallback(async () => {
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

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleRegister = async (event) => {
        setPendingEventId(event.id);
        try {
            const ticket = await registerForEvent(event.id);
            setTickets((current) => [...current, { ...ticket, event }]);
            setEvents((current) => current.map((item) => item.id === event.id
                ? { ...item, activeRegistered: item.activeRegistered + 1 }
                : item));
            notify({ tone: "success", title: "Inscription confirmée", description: event.title });
        } catch (requestError) {
            notify({ tone: "error", title: "Inscription impossible", description: getRegistrationError(requestError) });
        } finally {
            setPendingEventId(null);
        }
    };

    const now = Date.now();

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title="Événements"
                description="Découvrez les rendez-vous organisés par votre entreprise."
            />

            {loading ? (
                <div role="status" className="rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">
                    Chargement des événements…
                </div>
            ) : error ? (
                <Card>
                    <EmptyState
                        title="Les événements ne sont pas accessibles"
                        description="Vérifiez votre connexion au serveur puis réessayez."
                        action={<Button type="button" variant="outline" onClick={loadEvents}>Réessayer</Button>}
                    />
                </Card>
            ) : events.length === 0 ? (
                <Card>
                    <EmptyState title="Aucun événement disponible" description="Les prochains rendez-vous de votre entreprise apparaîtront ici." />
                </Card>
            ) : (
                <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {events.map((event) => {
                        const registered = isRegistered(tickets, event.id);
                        const eventHasStarted = new Date(event.startDate).getTime() <= now;
                        const full = event.activeRegistered >= event.maxCapacity;
                        const isPaid = event.price !== null && event.price !== undefined;
                        const canRegister = event.status === "published" && !eventHasStarted && !full && !registered && !isPaid;

                        return (
                            <StaggerItem key={event.id}>
                                <Card className="group flex h-full flex-col overflow-hidden transition-shadow duration-base hover:shadow-md">
                                    <div className="relative">
                                        <ImageWithFallback
                                            src={event.image || undefined}
                                            alt={event.title}
                                            className="h-52 w-full object-cover transition-transform duration-base group-hover:scale-[1.02]"
                                        />
                                        <Badge
                                            tone={event.status === "published" ? "success" : "neutral"}
                                            className="absolute left-4 top-4 bg-surface/95"
                                        >
                                            {eventStatusLabels[event.status] ?? event.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <h2 className="text-xl">{event.title}</h2>
                                        <div className="mt-4 grid gap-2.5 text-sm text-ink-muted">
                                            <p className="flex items-center gap-2.5">
                                                <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                                                <span>{formatDate(event.startDate)}</span>
                                            </p>
                                            <p className="flex items-center gap-2.5">
                                                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                                                <span>{event.location}</span>
                                            </p>
                                            <p className="flex items-center gap-2.5">
                                                <Users aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                                                <span>{event.activeRegistered} / {event.maxCapacity} inscrits</span>
                                            </p>
                                            <p className="flex items-center gap-2.5 font-semibold text-ink">
                                                <span aria-hidden="true" className="w-9 shrink-0 text-xs font-bold uppercase text-brand">Prix</span>
                                                <span>{formatPrice(event.price)}</span>
                                            </p>
                                            {isPaid && (
                                                <p className="text-xs text-ink-muted">Inscription en ligne indisponible pour le moment.</p>
                                            )}
                                        </div>
                                        <div className="mt-auto flex gap-2.5 pt-6">
                                            <Link
                                                to={`/user/events/${event.id}`}
                                                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-border px-3 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand-subtle hover:text-brand-strong"
                                            >
                                                Voir les détails
                                            </Link>
                                            <Button
                                                type="button"
                                                className="flex-1 px-3"
                                                disabled={!canRegister || pendingEventId === event.id}
                                                loading={pendingEventId === event.id}
                                                onClick={() => handleRegister(event)}
                                            >
                                                {registered ? "Inscrit" : isPaid ? "Indisponible" : full ? "Complet" : eventHasStarted ? "Commencé" : "Participer"}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            )}
        </div>
    );
}
