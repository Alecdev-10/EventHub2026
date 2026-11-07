import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, Eye, MapPin, Ticket } from "lucide-react";
import { getMyTickets } from "../../api/EventApi";
import { formatDate, formatTime, ticketStatusLabels } from "../../utils/format";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";

export default function UserTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadTickets = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            setTickets(await getMyTickets());
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    return (
        <div className="mx-auto max-w-6xl">
            <PageHeader
                title="Mes billets"
                description="Retrouvez ici vos billets et les informations utiles pour chaque événement."
            />

            {loading ? (
                <div role="status" className="rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Chargement de vos billets…</div>
            ) : error ? (
                <Card>
                    <EmptyState
                        title="Vos billets ne sont pas accessibles"
                        description="Vérifiez votre connexion au serveur puis réessayez."
                        action={<Button type="button" variant="outline" onClick={loadTickets}>Réessayer</Button>}
                    />
                </Card>
            ) : tickets.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Ticket}
                        title="Aucun billet pour le moment"
                        description="Inscrivez-vous à un événement pour recevoir votre billet."
                        action={<Link to="/user/events" className="inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong">Découvrir les événements</Link>}
                    />
                </Card>
            ) : (
                <Stagger className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {tickets.map((ticket) => (
                        <StaggerItem key={ticket.id}>
                            {(() => {
                                const usable = ticket.status === "confirmed" && ticket.event?.status === "published";
                                const label = ticket.event?.status === "cancelled"
                                    ? "Événement annulé"
                                    : ticket.event?.status === "ended" ? "Événement terminé"
                                        : ticket.event?.status !== "published" ? "Accès suspendu"
                                            : ticketStatusLabels[ticket.status] ?? ticket.status;
                                return (
                            <Card className="h-full overflow-hidden">
                                <div className="relative overflow-hidden bg-ink px-5 py-5 text-white sm:px-6">
                                    <div className="absolute -right-8 -top-16 h-44 w-44 rounded-full border border-white/10" />
                                    <div className="relative flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="mb-2 flex items-center gap-2 text-sm text-white/65">
                                                <Ticket aria-hidden="true" className="h-4 w-4 text-brand" /> Billet d’entrée
                                            </p>
                                            {usable && <p className="break-all text-xs font-medium tracking-wide text-white/55">{ticket.qrCode}</p>}
                                            <h2 className="mt-3 truncate text-2xl text-white">{ticket.event?.title ?? "Événement"}</h2>
                                        </div>
                                        <Badge tone={usable ? "success" : "neutral"}>
                                            {label}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
                                    <div className="grid content-start gap-4">
                                        <p className="flex items-start gap-3 text-sm text-ink-muted">
                                            <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                            <span>
                                                <span className="block text-xs text-ink-muted/80">Date et heure</span>
                                                <span className="mt-1 block font-medium text-ink">{formatDate(ticket.event?.startDate)} · {formatTime(ticket.event?.startDate)}</span>
                                            </span>
                                        </p>
                                        <p className="flex items-start gap-3 text-sm text-ink-muted">
                                            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                            <span>
                                                <span className="block text-xs text-ink-muted/80">Lieu</span>
                                                <span className="mt-1 block font-medium text-ink">{ticket.event?.location ?? "—"}</span>
                                            </span>
                                        </p>
                                    </div>
                                    {usable ? <div className="grid h-28 w-28 place-items-center self-center rounded-md border border-border bg-white p-2"><QRCodeSVG value={ticket.qrCode} size={96} level="M" title={`Code QR du billet pour ${ticket.event?.title ?? "l’événement"}`} /></div> : <p className="self-center text-xs text-ink-muted">Code d’accès indisponible</p>}
                                </div>

                                <div className="flex border-t border-border p-4 sm:p-5">
                                    <Link
                                        to={`/user/tickets/${ticket.id}`}
                                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
                                    >
                                        <Eye aria-hidden="true" className="h-4 w-4" /> Afficher le billet
                                    </Link>
                                </div>
                            </Card>
                                );
                            })()}
                        </StaggerItem>
                    ))}
                </Stagger>
            )}
        </div>
    );
}
