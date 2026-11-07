import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    MapPin,
    Ticket,
    UserRound,
    XCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cancelTicket, getMyTickets } from "../../api/EventApi";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate, formatTime, ticketStatusLabels } from "../../utils/format";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

export default function UserTicketDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const { notify } = useToast();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pending, setPending] = useState(false);

    const loadTicket = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const userTickets = await getMyTickets();
            setTicket(userTickets.find((item) => String(item.id) === String(id)) ?? null);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadTicket();
    }, [loadTicket]);

    const handleCancel = async () => {
        if (!window.confirm("Voulez-vous annuler votre inscription à cet événement ?")) return;
        setPending(true);
        try {
            await cancelTicket(ticket.id);
            setTicket((current) => ({ ...current, status: "cancelled", cancelledAt: new Date().toISOString() }));
            notify({ tone: "success", title: "Inscription annulée", description: ticket.event?.title ?? "Événement" });
        } catch (requestError) {
            const message = requestError.response?.data?.message
                ?? "L’annulation n’a pas abouti. Vérifiez votre connexion puis réessayez.";
            notify({ tone: "error", title: "Annulation impossible", description: message });
        } finally {
            setPending(false);
        }
    };

    if (loading) {
        return <div role="status" className="mx-auto max-w-4xl rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Chargement du billet…</div>;
    }

    if (error || !ticket) {
        return (
            <div className="mx-auto max-w-4xl">
                <Card>
                    <EmptyState
                        icon={Ticket}
                        title={error ? "Billet indisponible" : "Billet introuvable"}
                        description={error ? "Vérifiez votre connexion au serveur puis réessayez." : "Ce billet n’est plus disponible à cette adresse."}
                        action={error ? (
                            <Button type="button" variant="outline" onClick={loadTicket}>Réessayer</Button>
                        ) : (
                            <Link to="/user/tickets" className="inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-strong">Retour à mes billets</Link>
                        )}
                    />
                </Card>
            </div>
        );
    }

    const event = ticket.event ?? {};
    const isValid = ticket.status === "confirmed" && event.status === "published";
    const canCancel = isValid && new Date(event.startDate).getTime() > Date.now();
    const ticketLabel = event.status === "cancelled"
        ? "Événement annulé"
        : event.status === "ended" ? "Événement terminé"
            : event.status !== "published" ? "Accès suspendu"
                : ticketStatusLabels[ticket.status] ?? ticket.status;

    return (
        <div className="mx-auto max-w-4xl">
            <Link to="/user/tickets" className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand hover:text-brand-strong">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Mes billets
            </Link>

            <Card className="overflow-hidden">
                <div className="relative overflow-hidden bg-ink px-5 py-7 text-white sm:px-8 sm:py-9">
                    <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/10" />
                    <div className="relative flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white"><Ticket aria-hidden="true" className="h-5 w-5" /></span>
                            <div>
                                <p className="text-sm text-white/70">Billet d’entrée</p>
                                {isValid && <p className="mt-1 break-all text-xs tracking-wide text-white/60">{ticket.qrCode}</p>}
                            </div>
                        </div>
                        <Badge tone={isValid ? "success" : "neutral"} className="px-3 py-1.5">
                            {isValid ? <CheckCircle aria-hidden="true" className="h-4 w-4" /> : <XCircle aria-hidden="true" className="h-4 w-4" />}
                            {ticketLabel}
                        </Badge>
                    </div>
                    <h1 className="relative mt-7 text-3xl text-white sm:text-4xl">{event.title ?? "Événement"}</h1>
                    <p className="relative mt-2 text-sm text-white/65">Conservez le code de billet pour retrouver votre inscription.</p>
                </div>

                <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1fr_0.85fr]">
                    <div className="grid content-start gap-7">
                        <section>
                            <h2 className="text-xl">Informations de l’événement</h2>
                            <div className="mt-4 grid gap-4">
                                {isValid && <p className="flex items-start gap-3 text-sm">
                                    <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                    <span><span className="block text-xs text-ink-muted">Date et heure</span><span className="mt-1 block font-medium text-ink">{formatDate(event.startDate)} · {formatTime(event.startDate)}</span></span>
                                </p>}
                                <p className="flex items-start gap-3 text-sm">
                                    <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                    <span><span className="block text-xs text-ink-muted">Lieu</span><span className="mt-1 block font-medium text-ink">{event.location ?? "—"}</span></span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl">Participant</h2>
                            <div className="mt-4 grid gap-4">
                                <p className="flex items-start gap-3 text-sm">
                                    <UserRound aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                    <span><span className="block text-xs text-ink-muted">Nom</span><span className="mt-1 block font-medium text-ink">{user ? [user.firstName, user.name].join(" ") : "—"}</span></span>
                                </p>
                                <p className="flex items-start gap-3 text-sm">
                                    <Ticket aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                    <span><span className="block text-xs text-ink-muted">Code du billet</span><span className="mt-1 block break-all font-mono font-medium text-ink">{ticket.qrCode}</span></span>
                                </p>
                            </div>
                        </section>
                    </div>

                    {isValid ? <section>
                        <h2 className="text-xl">Votre code d’accès</h2>
                        <div className="mt-4 rounded-lg bg-surface-alt p-4">
                            <p className="mb-3 text-center text-sm text-ink-muted">Code associé à votre billet</p>
                            <div className="mx-auto grid min-h-48 w-full place-items-center rounded-md bg-white p-4 text-center text-sm text-ink shadow-sm">
                                <QRCodeSVG value={ticket.qrCode} size={180} level="M" title={`Code QR du billet pour ${event.title ?? "l’événement"}`} />
                            </div>
                        </div>
                    </section> : <section className="rounded-md bg-surface-alt p-5">
                        <h2 className="text-xl">Code d’accès indisponible</h2>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">{event.status === "cancelled" ? "Cet événement a été annulé. Ce billet ne permet plus l’accès." : event.status === "ended" ? "La période d’accès à cet événement est terminée." : event.status !== "published" ? "Les contrôles d’accès ne sont pas ouverts pour cet événement." : "Ce billet a déjà été utilisé ou annulé."}</p>
                    </section>}
                </div>

                {canCancel && (
                    <div className="flex justify-end border-t border-border p-5 sm:px-8">
                        <Button type="button" variant="outline" onClick={handleCancel} loading={pending}>Annuler mon inscription</Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
