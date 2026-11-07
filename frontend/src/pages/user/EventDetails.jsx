import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle, MapPin, Ticket, Users } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { cancelTicket, getEvent, getMyTickets, registerForEvent } from "../../api/EventApi";
import { useToast } from "../../contexts/ToastContext";
import { formatDate, formatPrice, formatTime } from "../../utils/format";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

function formatRequestError(error, action) {
    const code = error.response?.data?.code;
    if (code === "payment_required") return "Cet événement est payant. L’inscription en ligne sera disponible après l’intégration du paiement.";
    if (code === "registration_closed") return "Les inscriptions sont fermées car l’événement a commencé ou est terminé.";
    if (code === "event_unavailable") return "Les inscriptions ne sont pas ouvertes pour cet événement.";
    if (action === "register" && error.response?.status === 409) return "Vous êtes déjà inscrit à cet événement.";
    if (action === "register" && error.response?.status === 422) {
        const message = String(error.response.data?.message ?? "").toLowerCase();
        return message.includes("full") || message.includes("complet")
            ? "Cet événement affiche complet."
            : error.response.data?.message ?? "L’inscription n’a pas pu aboutir.";
    }
    if (action === "cancel" && error.response?.status === 422) {
        return error.response.data?.message ?? "L’inscription ne peut pas être annulée.";
    }
    if (!error.response) return "Le serveur est injoignable. Vérifiez votre connexion puis réessayez.";
    return action === "cancel" ? "L’annulation n’a pas abouti. Réessayez." : "L’inscription n’a pas abouti. Réessayez.";
}

export default function EventDetails() {
    const { id } = useParams();
    const { notify } = useToast();
    const [event, setEvent] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pending, setPending] = useState(false);

    const loadEvent = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [eventData, userTickets] = await Promise.all([getEvent(id), getMyTickets()]);
            setEvent(eventData);
            setTicket(userTickets.find((item) => Number(item.eventId) === Number(id)
                && ["confirmed", "checkedIn"].includes(item.status)) ?? null);
        } catch (requestError) {
            setError(requestError.response?.status === 404 ? "not-found" : "unavailable");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadEvent();
    }, [loadEvent]);

    const handleRegister = async () => {
        setPending(true);
        try {
            const createdTicket = await registerForEvent(event.id);
            setTicket(createdTicket);
            setEvent((current) => ({ ...current, activeRegistered: current.activeRegistered + 1 }));
            notify({ tone: "success", title: "Inscription confirmée", description: event.title });
        } catch (requestError) {
            notify({ tone: "error", title: "Inscription impossible", description: formatRequestError(requestError, "register") });
        } finally {
            setPending(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Voulez-vous annuler votre inscription à cet événement ?")) return;
        setPending(true);
        try {
            await cancelTicket(ticket.id);
            setTicket(null);
            setEvent((current) => ({ ...current, activeRegistered: Math.max(0, current.activeRegistered - 1) }));
            notify({ tone: "success", title: "Inscription annulée", description: event.title });
        } catch (requestError) {
            notify({ tone: "error", title: "Annulation impossible", description: formatRequestError(requestError, "cancel") });
        } finally {
            setPending(false);
        }
    };

    if (loading) {
        return <div role="status" className="mx-auto max-w-5xl rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Chargement de l’événement…</div>;
    }

    if (error || !event) {
        const notFound = error === "not-found";
        return (
            <div className="mx-auto max-w-5xl">
                <Card>
                    <EmptyState
                        title={notFound ? "Événement introuvable" : "Événement indisponible"}
                        description={notFound ? "Cet événement n’est plus disponible à cette adresse." : "Vérifiez votre connexion au serveur puis réessayez."}
                        action={notFound ? (
                            <Link to="/user/events" className="inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong">Retour aux événements</Link>
                        ) : (
                            <Button type="button" variant="outline" onClick={loadEvent}>Réessayer</Button>
                        )}
                    />
                </Card>
            </div>
        );
    }

    const isFull = event.activeRegistered >= event.maxCapacity;
    const isPaid = event.price !== null && event.price !== undefined;
    const hasStarted = new Date(event.startDate).getTime() <= Date.now();
    const canRegister = event.status === "published" && !isFull && !hasStarted && !ticket && !isPaid;
    const canCancel = ticket?.status === "confirmed" && !hasStarted;

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                to="/user/events"
                className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
            >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Tous les événements
            </Link>

            <Card className="mb-6 overflow-hidden">
                <ImageWithFallback src={event.image || undefined} alt={event.title} className="h-56 w-full object-cover sm:h-80" />
                <div className="p-5 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-3xl sm:text-4xl">{event.title}</h1>
                            <div className="mt-5 grid gap-3 text-sm text-ink-muted">
                                <p className="flex items-center gap-2.5">
                                    <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                                    {formatDate(event.startDate)} à {formatTime(event.startDate)}
                                </p>
                                <p className="flex items-center gap-2.5">
                                    <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                                    {event.location}
                                </p>
                                <p className="flex items-center gap-2.5">
                                    <Users aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                                    {event.activeRegistered} / {event.maxCapacity} participants
                                </p>
                                <p className="flex items-center gap-2.5 font-semibold text-ink">
                                    <span aria-hidden="true" className="w-9 shrink-0 text-xs font-bold uppercase text-brand">Prix</span>
                                    {formatPrice(event.price)}
                                </p>
                            </div>
                            {isPaid && <p className="mt-3 text-sm text-ink-muted">Inscription en ligne indisponible pour le moment.</p>}
                        </div>
                        {ticket ? (
                            <Badge tone="success" className="self-start px-4 py-2 text-sm">
                                <CheckCircle aria-hidden="true" className="h-4 w-4" /> Inscrit
                            </Badge>
                        ) : (
                            <Button type="button" onClick={handleRegister} loading={pending} disabled={!canRegister}>
                                {isPaid ? "Indisponible" : isFull ? "Complet" : hasStarted ? "Événement commencé" : "Participer"}
                            </Button>
                        )}
                    </div>

                    <div className="mt-7 border-t border-border pt-6">
                        <h2 className="text-xl">À propos de l’événement</h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{event.description}</p>
                    </div>
                </div>
            </Card>

            {ticket && (
                <div className="mt-6 max-w-2xl">
                    <Card className="overflow-hidden">
                        <div className="border-b border-border px-5 py-5 sm:px-6">
                            <p className="text-sm text-ink-muted">Accès à l’événement</p>
                            <h2 className="mt-1 text-xl">Votre billet</h2>
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="rounded-lg bg-ink p-5 text-white">
                                <p className="text-xs font-medium text-white/60">Code de votre billet</p>
                                <p className="mt-3 break-all font-mono text-sm text-white">{ticket.qrCode}</p>
                                <p className="mt-4 text-sm text-white/70">Votre inscription est enregistrée. Conservez ce code pour retrouver votre billet.</p>
                            </div>
                            {canCancel && (
                                <Button type="button" variant="outline" className="mt-4 w-full" onClick={handleCancel} loading={pending}>
                                    Annuler mon inscription
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
