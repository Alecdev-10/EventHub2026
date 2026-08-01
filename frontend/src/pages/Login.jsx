import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const roleHome = {
    superAdmin: "/admin",
    eventManager: "/admin",
    scanAgent: "/scan-agent",
    participant: "/user",
};

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const role = await login({ email, password });
            navigate(roleHome[role] ?? "/user");
        } catch (err) {
            setError(err.response?.data?.message ?? "Identifiants invalides");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-[#3B82F6] mb-2">EventFlow</h1>
                    <p className="text-gray-600">Connectez-vous à votre compte</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
                    )}

                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#3B82F6] text-white py-3 rounded-lg hover:bg-[#2563EB] transition-colors shadow-lg disabled:opacity-60"
                    >
                        {submitting ? "Connexion..." : "Se connecter"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Pas encore de compte ?{" "}
                        <Link to="/Register" className="text-[#3B82F6] hover:underline">
                            Inscrivez-vous
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
