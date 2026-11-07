import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Eye, EyeOff, Lock, Mail, TicketCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/Logo";
import BrandPanel from "../components/BrandPanel";
import BrandFooter from "../components/ui/BrandFooter";
import { getAuthError } from "../utils/authErrors";

const roleHome = {
    scanAgent: "/scan-agent",
    participant: "/user",
};

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { notify } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field, setter) => (event) => {
        setter(event.target.value);
        setError((current) => {
            if (!current) return null;
            const fields = { ...current.fields };
            delete fields[field];
            return Object.keys(fields).length
                ? { message: "Vérifiez les informations indiquées ci-dessous.", fields }
                : null;
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const result = await login({ email, password });
            if (result.backofficeLoginUrl) {
                notify({
                    tone: "info",
                    title: "Redirection en cours",
                    description: "Vous serez redirigés vers la bonne adresse pour vous connecter.",
                    duration: 1200,
                });
                await new Promise((resolve) => window.setTimeout(resolve, 650));
                window.location.assign(result.backofficeLoginUrl);
                return;
            }
            notify({ tone: "success", title: "Connexion réussie", description: "Bienvenue dans votre espace EventHub." });
            navigate(roleHome[result.role] ?? "/login");
        } catch (err) {
            setError(getAuthError(err, { isLogin: true }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
            <BrandPanel>
                <p className="relative z-10 text-sm font-medium text-white/70">
                    L’espace événementiel de votre entreprise
                </p>
                <div className="relative z-10 mt-12 max-w-xl lg:mt-0">
                    <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                        <TicketCheck aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <p className="mb-4 text-sm font-medium text-white/60">Un espace commun à vos équipes</p>
                    <h2 className="max-w-lg text-4xl leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                        Les bons moments, bien orchestrés.
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                        Rassemblez les événements, invitations et billets qui rythment votre entreprise.
                    </p>
                </div>
                <p className="relative z-10 mt-10 text-sm text-white/55 lg:mt-0">
                    Votre entreprise et ses activités, au même endroit.
                </p>
            </BrandPanel>

            <section className="flex min-h-screen flex-col items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
                <div className="flex w-full max-w-md flex-1 flex-col justify-center">
                    <Logo className="mb-12" />
                    <div className="mb-9">
                        <p className="mb-3 text-sm font-semibold text-brand">
                            Heureux de vous revoir
                        </p>
                        <h1 className="text-3xl sm:text-4xl">Connexion</h1>
                        <p className="mt-3 text-sm leading-6 text-ink-muted">
                            Connectez-vous pour retrouver votre espace et vos événements.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="grid gap-5">
                        {error?.message && (
                            <div
                                role="alert"
                                className="rounded-md border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
                            >
                                {error.message}
                            </div>
                        )}

                        <Input
                            label="Adresse e-mail"
                            type="email"
                            icon={Mail}
                            value={email}
                            onChange={handleChange("email", setEmail)}
                            placeholder="vous@exemple.com"
                            autoComplete="email"
                            error={error?.fields?.email}
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type={showPassword ? "text" : "password"}
                            icon={Lock}
                            value={password}
                            onChange={handleChange("password", setPassword)}
                            placeholder="••••••••"
                            autoComplete="current-password"
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

                        <Button type="submit" loading={submitting} className="mt-2 w-full">
                            {submitting ? "Connexion..." : "Se connecter"}
                            {!submitting && <ArrowUpRight aria-hidden="true" className="h-4 w-4" />}
                        </Button>

                        <p className="pt-2 text-center text-sm text-ink-muted">
                            Pas encore de compte ?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-brand underline-offset-4 hover:underline"
                            >
                                Inscrivez-vous
                            </Link>
                        </p>
                        <p className="text-center text-sm text-ink-muted">
                            Une question ou un problème ?{" "}
                            <Link to="/contact" className="font-semibold text-brand underline-offset-4 hover:underline">
                                Contacter l’équipe
                            </Link>
                        </p>
                    </form>
                </div>
                <BrandFooter className="w-full max-w-md py-3" />
            </section>
        </main>
    );
}
