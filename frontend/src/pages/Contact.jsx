import { createElement, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircleWarning, UserRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import * as AuthApi from "../api/AuthApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import Textarea from "../components/ui/Textarea";
import Logo from "../components/Logo";
import BrandFooter from "../components/ui/BrandFooter";

const categoriesByType = {
    contact: [
        { value: "general", label: "Question générale" },
        { value: "event", label: "À propos d’un événement" },
        { value: "partnership", label: "Partenariat" },
        { value: "other", label: "Autre demande" },
    ],
    problem: [
        { value: "account", label: "Compte et connexion" },
        { value: "event", label: "Événement" },
        { value: "ticket", label: "Billet ou invitation" },
        { value: "technical", label: "Problème technique" },
        { value: "other", label: "Autre problème" },
    ],
};

const initialForm = (user) => ({
    name: [user?.firstName, user?.name].filter(Boolean).join(" "),
    email: user?.email ?? "",
    subject: "",
    category: "general",
    reference: "",
    message: "",
});

function makeIdempotencyKey() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = Math.floor(Math.random() * 16);
        return (char === "x" ? random : (random & 0x3) | 0x8).toString(16);
    });
}

function getRequestError(error) {
    const validationErrors = error.response?.data?.errors ?? {};
    const fields = Object.fromEntries(
        Object.entries(validationErrors).map(([field, messages]) => [field, messages[0]])
    );

    if (Object.keys(fields).length) {
        return { message: "Certaines informations sont à corriger.", fields };
    }
    if (error.response?.status === 409) {
        return { message: error.response.data.message, fields: {} };
    }
    if (error.response?.status === 429) {
        return { message: "Trop de demandes ont été envoyées. Réessayez dans quelques minutes.", fields: {} };
    }
    if (!error.response) {
        return { message: "Le serveur est injoignable. Votre message n’a pas été confirmé ; vous pouvez réessayer.", fields: {} };
    }
    return { message: "La demande n’a pas pu être enregistrée. Réessayez dans quelques instants.", fields: {} };
}

export default function Contact() {
    const { user } = useAuth();
    const { notify } = useToast();
    const returnPath = user?.role === "scanAgent" ? "/scan-agent" : user ? "/user" : "/login";
    const [type, setType] = useState("contact");
    const [form, setForm] = useState(() => initialForm(user));
    const [idempotencyKey, setIdempotencyKey] = useState(makeIdempotencyKey);
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const updateForm = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setIdempotencyKey(makeIdempotencyKey());
        setFieldErrors((current) => {
            const next = { ...current };
            delete next[name];
            return next;
        });
        setError("");
        setResult(null);
    };

    const changeType = (nextType) => {
        setType(nextType);
        setForm((current) => ({ ...current, category: categoriesByType[nextType][0].value, reference: "" }));
        setIdempotencyKey(makeIdempotencyKey());
        setFieldErrors({});
        setError("");
        setResult(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setFieldErrors({});
        setSubmitting(true);

        const payload = {
            type,
            name: form.name,
            email: form.email,
            subject: form.subject,
            category: form.category,
            message: form.message,
            website: event.currentTarget.elements.website.value,
            ...(type === "problem" && form.reference.trim() ? { reference: form.reference.trim() } : {}),
        };

        try {
            const { data } = await AuthApi.createSupportRequest(payload, idempotencyKey);
            setResult(data);
            notify({
                tone: data.notification_status === "sent" ? "success" : "info",
                title: data.notification_status === "sent" ? "Demande transmise" : "Demande enregistrée",
                description: data.notification_status === "sent"
                    ? "Le service client a reçu votre message."
                    : "Votre demande est conservée, mais le courriel n’a pas été transmis.",
            });
            if (data.notification_status === "sent") {
                setForm(initialForm(user));
                setIdempotencyKey(makeIdempotencyKey());
            }
        } catch (requestError) {
            const details = getRequestError(requestError);
            setError(details.message);
            setFieldErrors(details.fields);
        } finally {
            setSubmitting(false);
        }
    };

    const categories = categoriesByType[type];
    const canRetryNotification = result && ["failed", "not_configured"].includes(result.notification_status);

    return (
        <main className="min-h-screen bg-surface-alt px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <Logo />
                    <Link to={returnPath} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand hover:text-brand-strong">
                        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                        {user ? "Retour à mon espace" : "Retour à la connexion"}
                    </Link>
                </div>

                <PageHeader
                    eyebrow="L’équipe EventHub vous répond"
                    title="Comment pouvons-nous vous aider ?"
                    description="Choisissez le type de demande et donnez-nous les détails utiles. Votre message sera transmis au service client de l’entreprise."
                />

                <Card className="p-5 sm:p-8">
                    {result && (
                        <div
                            role={canRetryNotification ? "alert" : "status"}
                            className={`mb-6 rounded-md border px-4 py-3 text-sm ${canRetryNotification ? "border-warning/25 bg-warning/5 text-warning" : "border-success/20 bg-success/5 text-success"}`}
                        >
                            <p className="font-semibold">{result.message}</p>
                            {canRetryNotification && (
                                <p className="mt-1">Votre demande est conservée. Vous pouvez réessayer l’envoi sans créer de doublon.</p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div role="alert" className="mb-6 rounded-md border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-5">
                        <fieldset disabled={submitting}>
                            <legend className="mb-3 text-sm font-semibold text-ink">Votre demande</legend>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { value: "contact", label: "Nous contacter", description: "Une question ou une demande", Icon: Mail },
                                    { value: "problem", label: "Signaler un problème", description: "Un souci avec le compte, un billet ou un événement", Icon: MessageCircleWarning },
                                ].map(({ value, label, description, Icon }) => (
                                    <label
                                        key={value}
                                        className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors ${type === value ? "border-brand bg-brand-subtle/60" : "border-border hover:border-brand/40 hover:bg-surface-alt"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="request_type"
                                            value={value}
                                            checked={type === value}
                                            onChange={() => changeType(value)}
                                            className="mt-1 h-4 w-4 shrink-0 accent-brand"
                                        />
                                        {createElement(Icon, { "aria-hidden": true, className: "mt-0.5 h-5 w-5 shrink-0 text-brand" })}
                                        <span>
                                            <span className="block text-sm font-semibold text-ink">{label}</span>
                                            <span className="mt-1 block text-xs leading-5 text-ink-muted">{description}</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Nom"
                                icon={UserRound}
                                name="name"
                                value={form.name}
                                onChange={updateForm}
                                autoComplete="name"
                                maxLength={120}
                                error={fieldErrors.name}
                                required
                            />
                            <Input
                                label="Adresse e-mail"
                                icon={Mail}
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={updateForm}
                                autoComplete="email"
                                maxLength={254}
                                error={fieldErrors.email}
                                required
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="support-category" className="text-sm font-semibold text-ink">
                                    {type === "problem" ? "Type de problème" : "Motif"}
                                </label>
                                <select
                                    id="support-category"
                                    name="category"
                                    value={form.category}
                                    onChange={updateForm}
                                    aria-invalid={fieldErrors.category ? "true" : undefined}
                                    className={`min-h-12 w-full rounded-md border bg-surface px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-fast focus:border-brand focus:ring-4 focus:ring-brand/10 ${fieldErrors.category ? "border-danger" : "border-border hover:border-ink-muted/50"}`}
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category.value} value={category.value}>{category.label}</option>
                                    ))}
                                </select>
                                {fieldErrors.category && <p role="alert" className="text-sm text-danger">{fieldErrors.category}</p>}
                            </div>
                            <Input
                                label={type === "problem" ? "Sujet du problème" : "Sujet"}
                                name="subject"
                                value={form.subject}
                                onChange={updateForm}
                                maxLength={160}
                                error={fieldErrors.subject}
                                required
                            />
                        </div>

                        {type === "problem" && ["event", "ticket"].includes(form.category) && (
                            <Input
                                label={form.category === "event" ? "Référence de l’événement (facultatif)" : "Référence du billet (facultatif)"}
                                name="reference"
                                value={form.reference}
                                onChange={updateForm}
                                maxLength={120}
                                error={fieldErrors.reference}
                            />
                        )}

                        <Textarea
                            label={type === "problem" ? "Décrivez le problème" : "Votre message"}
                            name="message"
                            value={form.message}
                            onChange={updateForm}
                            minLength={10}
                            maxLength={5000}
                            hint="10 caractères minimum. N’indiquez pas de mot de passe ni de donnée bancaire."
                            error={fieldErrors.message}
                            required
                        />

                        <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden">
                            <label htmlFor="support-website">Site web</label>
                            <input id="support-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-ink-muted">Aucune pièce jointe. N’indiquez pas de mot de passe ni de donnée bancaire.</p>
                            <Button type="submit" loading={submitting} disabled={submitting}>
                                {submitting ? "Envoi en cours…" : canRetryNotification ? "Réessayer l’envoi" : "Envoyer la demande"}
                            </Button>
                        </div>
                    </form>
                </Card>
                <BrandFooter className="mt-8" />
            </div>
        </main>
    );
}
