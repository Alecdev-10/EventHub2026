import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone, TicketCheck, UserRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/Logo";
import BrandPanel from "../components/BrandPanel";
import BrandFooter from "../components/ui/BrandFooter";
import { getAuthError } from "../utils/authErrors";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { notify } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        email: "",
        telephone: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError((current) => {
            if (!current) return null;
            const fields = { ...current.fields };
            delete fields[e.target.name];
            return Object.keys(fields).length
                ? { message: "Vérifiez les informations indiquées ci-dessous.", fields }
                : null;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.password_confirmation) {
            setError({
                message: "Les mots de passe ne correspondent pas.",
                fields: { password_confirmation: "Ressaisissez le même mot de passe." },
            });
            return;
        }

        setSubmitting(true);
        try {
            await register(formData);
            notify({ tone: "success", title: "Compte créé", description: "Votre espace EventHub est prêt." });
            navigate("/user");
        } catch (err) {
            setError(getAuthError(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="grid min-h-screen bg-surface lg:grid-cols-[0.9fr_1.1fr]">
            <BrandPanel className="min-h-[240px]">
                <p className="relative z-10 text-sm font-medium text-white/70">
                    Pensé pour votre entreprise et ses activités
                </p>
                <div className="relative z-10 mt-10 max-w-xl lg:mt-0">
                    <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                        <TicketCheck aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <p className="mb-4 text-sm font-medium text-white/60">Un espace commun à vos équipes</p>
                    <h2 className="max-w-lg text-4xl leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl">
                        Tout ce qui rassemble vos équipes.
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                        Événements, invitations et billets réunis dans un espace conçu pour votre entreprise.
                    </p>
                </div>
                <p className="relative z-10 mt-10 text-sm text-white/55 lg:mt-0">
                    Votre entreprise et ses activités, au même endroit.
                </p>
            </BrandPanel>

            <section className="flex min-h-screen flex-col items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
                <div className="flex w-full max-w-2xl flex-1 flex-col justify-center">
                    <Logo className="mb-9" />
                    <div className="mb-7">
                        <p className="mb-3 text-sm font-medium text-brand">Rejoignez votre espace</p>
                        <h1 className="text-3xl sm:text-4xl">Créer mon compte</h1>
                        <p className="mt-3 text-sm leading-6 text-ink-muted">
                            Quelques informations pour accéder à vos activités et événements.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {error?.message && (
                            <div
                                role="alert"
                                className="rounded-md border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
                            >
                                {error.message}
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Prénom"
                                icon={UserRound}
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Marie"
                                autoComplete="given-name"
                                error={error?.fields?.firstName}
                                required
                            />
                            <Input
                                label="Nom"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Dubois"
                                autoComplete="family-name"
                                error={error?.fields?.name}
                                required
                            />
                        </div>

                        <Input
                            label="Adresse e-mail"
                            icon={Mail}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="vous@exemple.com"
                            autoComplete="email"
                            error={error?.fields?.email}
                            required
                        />

                        <Input
                            label="Téléphone"
                            icon={Phone}
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="+33 6 12 34 56 78"
                            autoComplete="tel"
                            error={error?.fields?.telephone}
                            required
                        />

                        <Input
                            label="Mot de passe"
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="8 caractères min, majuscule + caractère spécial"
                            hint="8 caractères minimum, avec une majuscule, une minuscule, un chiffre et un caractère spécial."
                            autoComplete="new-password"
                            error={error?.fields?.password}
                            required
                            endAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    aria-pressed={showPassword}
                                    className="rounded p-1.5 text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                                >
                                    {showPassword ? (
                                        <EyeOff aria-hidden="true" className="h-4 w-4" />
                                    ) : (
                                        <Eye aria-hidden="true" className="h-4 w-4" />
                                    )}
                                </button>
                            }
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            icon={Lock}
                            type={showConfirmation ? "text" : "password"}
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Ressaisissez le mot de passe"
                            autoComplete="new-password"
                            error={error?.fields?.password_confirmation}
                            required
                            endAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmation((visible) => !visible)}
                                    aria-label={showConfirmation ? "Masquer la confirmation" : "Afficher la confirmation"}
                                    aria-pressed={showConfirmation}
                                    className="rounded p-1.5 text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                                >
                                    {showConfirmation ? (
                                        <EyeOff aria-hidden="true" className="h-4 w-4" />
                                    ) : (
                                        <Eye aria-hidden="true" className="h-4 w-4" />
                                    )}
                                </button>
                            }
                        />

                        <Button type="submit" loading={submitting} className="mt-2 w-full">
                            {submitting ? "Création..." : "Créer mon compte"}
                        </Button>

                        <p className="pt-1 text-center text-sm text-ink-muted">
                            Déjà inscrit ?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-brand underline-offset-4 hover:underline"
                            >
                                Connectez-vous
                            </Link>
                        </p>
                        <p className="text-center text-sm text-ink-muted">
                            Besoin d’aide ?{" "}
                            <Link to="/contact" className="font-semibold text-brand underline-offset-4 hover:underline">
                                Contactez l’équipe
                            </Link>
                        </p>
                    </form>
                </div>
                <BrandFooter className="w-full max-w-2xl py-3" />
            </section>
        </main>
    );
}
