import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        email: "",
        telephone: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.password_confirmation) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setSubmitting(true);
        try {
            await register(formData);
            navigate("/user");
        } catch (err) {
            const message =
                err.response?.data?.message ??
                Object.values(err.response?.data?.errors ?? {})[0]?.[0] ??
                "Impossible de créer le compte";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-[#3B82F6] mb-2">EventHub</h1>
                    <p className="text-gray-600">Créez votre compte</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Prénom</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Marie"
                                    className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Nom</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Dubois"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="votre@email.com"
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Téléphone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                placeholder="+33 6 12 34 56 78"
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8 caractères min, majuscule + caractère spécial"
                                minLength={8}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Ressaisissez le mot de passe"
                                minLength={8}
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
                        {submitting ? "Création..." : "Créer mon compte"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Déjà inscrit ?{" "}
                        <Link to="/Login" className="text-[#3B82F6] hover:underline">
                            Connectez-vous
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
