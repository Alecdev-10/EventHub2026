import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createElement } from "react";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock3,
    QrCode,
    ScanLine,
    TicketCheck,
    XCircle,
} from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { getRecentCheckins, scanTicket } from "../../api/EventApi";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const MotionDiv = m.div;

const statusDetails = {
    valid: { title: "Billet valide", label: "Entrée autorisée", tone: "success", icon: CheckCircle },
    duplicate: { title: "Billet déjà utilisé", label: "Vérifiez auprès du responsable", tone: "warning", icon: AlertCircle },
    invalid: { title: "Billet invalide", label: "Ce billet ne permet pas l’accès", tone: "danger", icon: XCircle },
    not_started: { title: "Événement pas encore commencé", label: "Le scan sera possible à l’heure de début", tone: "warning", icon: Clock3 },
    event_ended: { title: "Contrôle terminé", label: "La période de scan est terminée", tone: "neutral", icon: Clock3 },
    error: { title: "Scan impossible", label: "Vérifiez votre connexion puis réessayez", tone: "danger", icon: XCircle },
};

const toneClasses = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    neutral: "bg-surface-alt text-ink-muted",
};

function getScanStatus(error) {
    const code = error.response?.data?.code;
    if (code === "event_not_started") return "not_started";
    if (code === "event_ended") return "event_ended";
    if (code === "ticket_not_found") return "invalid";
    return error.response?.data?.status === "invalid" ? "invalid" : "error";
}

function formatScanTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function ScanAgentScanner() {
    const { notify } = useToast();
    const inputRef = useRef(null);
    const videoRef = useRef(null);
    const cameraControlsRef = useRef(null);
    const scanLockRef = useRef(false);
    const [qrCode, setQrCode] = useState("");
    const [scanResult, setScanResult] = useState(null);
    const [activity, setActivity] = useState(null);
    const [activityError, setActivityError] = useState(false);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [pending, setPending] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const reduceMotion = useReducedMotion();

    const loadActivity = useCallback(async () => {
        setLoadingActivity(true);
        setActivityError(false);
        try {
            setActivity(await getRecentCheckins(10));
        } catch {
            setActivityError(true);
        } finally {
            setLoadingActivity(false);
        }
    }, []);

    useEffect(() => { loadActivity(); }, [loadActivity]);

    const stopCamera = useCallback(() => {
        cameraControlsRef.current?.stop();
        cameraControlsRef.current = null;
        setCameraActive(false);
    }, []);

    const performScan = useCallback(async (value) => {
        const normalizedCode = value.trim();
        if (!normalizedCode || scanLockRef.current) return;

        scanLockRef.current = true;
        setPending(true);
        setScanResult(null);
        try {
            const response = await scanTicket(normalizedCode);
            const result = { ...response, type: response.status };
            setScanResult(result);
            notify({
                tone: response.status === "valid" ? "success" : response.status === "duplicate" ? "info" : "error",
                title: statusDetails[response.status]?.title ?? "Résultat du scan",
                description: response.message,
            });
            await loadActivity();
        } catch (error) {
            const type = getScanStatus(error);
            const result = {
                type,
                message: error.response?.data?.message ?? statusDetails[type].label,
                event: error.response?.data?.event,
            };
            setScanResult(result);
            notify({ tone: type === "not_started" || type === "event_ended" ? "info" : "error", title: statusDetails[type].title, description: result.message });
            await loadActivity();
        } finally {
            scanLockRef.current = false;
            setPending(false);
            setQrCode("");
            inputRef.current?.focus();
        }
    }, [loadActivity, notify]);

    const handleScan = (event) => {
        event.preventDefault();
        performScan(qrCode);
    };

    const startCamera = async () => {
        setCameraError(null);
        try {
            const { BrowserQRCodeReader } = await import("@zxing/browser");
            const reader = new BrowserQRCodeReader();
            cameraControlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (decoded, scanError, controls) => {
                if (scanError && !decoded) return;
                if (!decoded || scanLockRef.current) return;
                controls.stop();
                cameraControlsRef.current = null;
                setCameraActive(false);
                const code = decoded.getText();
                setQrCode(code);
                performScan(code);
            });
            setCameraActive(true);
        } catch {
            setCameraActive(false);
            setCameraError("La caméra n’est pas accessible. Autorisez son utilisation ou saisissez le code manuellement.");
        }
    };

    useEffect(() => () => cameraControlsRef.current?.stop(), []);

    const resultType = scanResult?.type;
    const result = resultType ? (statusDetails[resultType] ?? statusDetails.invalid) : null;
    const today = activity?.today ?? {};
    const recent = activity?.recent?.data ?? [];
    const validToday = Number(today.valid ?? 0);
    const duplicateToday = Number(today.duplicate ?? 0);
    const invalidToday = Number(today.invalid ?? 0);

    return (
        <div className="mx-auto max-w-7xl">
            <Link to="/scan-agent" className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand hover:text-brand-strong">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Retour au tableau de bord
            </Link>
            <PageHeader title="Scanner un billet" description="Lisez le code QR du participant pour vérifier son accès en temps réel." />

            <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.5fr_0.75fr]">
                <Card className="p-4 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm text-ink-muted">Contrôle d’accès</p>
                            <h2 className="mt-1 text-xl">Vérifier un billet</h2>
                        </div>
                        <div role="status" aria-live="polite" className="inline-flex items-center gap-2 rounded-md bg-surface-alt px-3 py-2 text-sm font-medium text-ink">
                            <span className={["h-2.5 w-2.5 rounded-full", pending ? "bg-warning" : "bg-success"].join(" ")} />
                            {pending ? "Vérification…" : "Prêt à scanner"}
                        </div>
                    </div>

                    <div className="relative mb-5 grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-ink sm:aspect-video">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ink-muted/35 via-ink/80 to-ink" />
                        <video ref={videoRef} aria-label="Aperçu de la caméra pour lire un billet" autoPlay muted playsInline className={["absolute inset-0 h-full w-full object-cover", cameraActive ? "block" : "hidden"].join(" ")} />
                        {!cameraActive && <QrCode aria-hidden="true" className="absolute h-20 w-20 text-white/10" />}
                        <div className="relative z-10 grid aspect-square w-[min(62vw,18rem)] place-items-center rounded-lg border-2 border-brand/80">
                            <span className="absolute -left-0.5 -top-0.5 h-10 w-10 rounded-tl-lg border-l-4 border-t-4 border-white" />
                            <span className="absolute -right-0.5 -top-0.5 h-10 w-10 rounded-tr-lg border-r-4 border-t-4 border-white" />
                            <span className="absolute -bottom-0.5 -left-0.5 h-10 w-10 rounded-bl-lg border-b-4 border-l-4 border-white" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-10 w-10 rounded-br-lg border-b-4 border-r-4 border-white" />
                            {!cameraActive && <ScanLine aria-hidden="true" className="h-10 w-10 text-white/65" />}
                        </div>
                        <LazyMotion features={domAnimation}>
                            <AnimatePresence>
                                {result && (
                                    <MotionDiv
                                        key={`${resultType}-${scanResult.message}`}
                                        role="alert"
                                        aria-live="assertive"
                                        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={reduceMotion ? undefined : { opacity: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.14 }}
                                        className="absolute inset-0 z-20 grid place-items-center bg-ink/95 p-5 text-center text-white"
                                    >
                                        <div className="max-w-sm">
                                            <span className={["mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full", toneClasses[result.tone]].join(" ")}>
                                                {createElement(result.icon, { "aria-hidden": true, className: "h-8 w-8" })}
                                            </span>
                                            <h2 className="text-2xl text-white">{result.title}</h2>
                                            <p className="mt-3 text-sm text-white/80">{scanResult.message ?? result.label}</p>
                                            {scanResult.event?.title && <p className="mt-2 text-sm font-semibold text-white">{scanResult.event.title}</p>}
                                            {scanResult.checkIn?.scannedAt && <p className="mt-3 text-xs text-white/55">{formatScanTime(scanResult.checkIn.scannedAt)}</p>}
                                        </div>
                                    </MotionDiv>
                                )}
                            </AnimatePresence>
                        </LazyMotion>
                    </div>

                    <p className="mb-4 flex items-center justify-center gap-2 text-center text-sm text-ink-muted">
                        <ScanLine aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                        {cameraActive ? "Placez le QR code du billet dans le cadre." : "Lisez le billet avec la caméra, un lecteur QR ou en saisissant son code."}
                    </p>
                    {cameraError && <p role="alert" className="mb-3 text-center text-sm text-danger">{cameraError}</p>}
                    <form onSubmit={handleScan} className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                        <label className="sr-only" htmlFor="ticket-qr-code">Code du billet</label>
                        <input
                            ref={inputRef}
                            id="ticket-qr-code"
                            name="qrCode"
                            type="text"
                            autoComplete="off"
                            autoFocus
                            value={qrCode}
                            onChange={(event) => setQrCode(event.target.value)}
                            placeholder="Code du billet"
                            className="min-h-12 min-w-0 flex-1 rounded-md border border-border bg-surface px-4 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                            disabled={pending}
                        />
                        {cameraActive ? <Button type="button" variant="outline" onClick={stopCamera}>Arrêter la caméra</Button> : <Button type="button" variant="outline" onClick={startCamera}><QrCode aria-hidden="true" className="h-4 w-4" />Ouvrir la caméra</Button>}
                        <Button type="submit" loading={pending} disabled={!qrCode.trim() || pending}>
                            <TicketCheck aria-hidden="true" className="h-4 w-4" /> Vérifier le billet
                        </Button>
                    </form>
                </Card>

                <div className="grid content-start gap-5 sm:grid-cols-2 2xl:grid-cols-1">
                    <Card className="p-5">
                        <p className="text-sm text-ink-muted">Vos contrôles du jour</p>
                        <h2 className="mt-1 text-xl">Résultats des contrôles</h2>
                        {loadingActivity ? <p role="status" className="mt-4 text-sm text-ink-muted">Chargement de l’activité…</p> : activityError ? (
                            <EmptyState title="Activité indisponible" description="Impossible de charger vos contrôles." action={<Button type="button" variant="outline" onClick={loadActivity}>Réessayer</Button>} />
                        ) : (
                            <div className="mt-4 grid gap-2">
                                {[
                                    ["Validés", validToday, CheckCircle, "text-success", "bg-success/5"],
                                    ["Doublons", duplicateToday, AlertCircle, "text-warning", "bg-warning/5"],
                                    ["Invalides", invalidToday, XCircle, "text-danger", "bg-danger/5"],
                                ].map(([label, count, Icon, color, background]) => (
                                    <div key={label} className={["flex items-center justify-between rounded-md px-3 py-3", background].join(" ")}>
                                        <span className="flex items-center gap-2 text-sm font-medium text-ink">{createElement(Icon, { "aria-hidden": true, className: ["h-4 w-4", color].join(" ") })}{label}</span>
                                        <span className={["font-semibold", color].join(" ")}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="p-5">
                        <p className="text-sm text-ink-muted">Historique enregistré</p>
                        <h2 className="mt-1 text-xl">Derniers scans</h2>
                        {loadingActivity ? <p role="status" className="mt-4 text-sm text-ink-muted">Chargement…</p> : activityError ? (
                            <p className="mt-4 text-sm text-ink-muted">Réessayez pour afficher les scans enregistrés.</p>
                        ) : recent.length === 0 ? (
                            <p className="mt-4 text-sm text-ink-muted">Aucun scan enregistré pour le moment.</p>
                        ) : (
                            <div className="mt-4 divide-y divide-border">
                                {recent.map((scan) => {
                                    const details = statusDetails[scan.status === "valid" ? "valid" : scan.status === "duplicate" ? "duplicate" : "invalid"];
                                    const StatusIcon = details.icon;
                                    return (
                                        <div key={scan.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-ink">{scan.ticket?.event?.title ?? "Événement"}</p>
                                                <p className="mt-1 truncate text-xs text-ink-muted">{scan.ticket?.qrCode} · {formatScanTime(scan.scannedAt)}</p>
                                            </div>
                                            {createElement(StatusIcon, { "aria-label": details.title, className: ["h-4 w-4 shrink-0", details.tone === "success" ? "text-success" : details.tone === "warning" ? "text-warning" : "text-danger"].join(" ") })}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
