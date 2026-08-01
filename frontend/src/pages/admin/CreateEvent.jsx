import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, FileText, Image, Clock, Users } from "lucide-react";

export default function CreateEvent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        maxCapacity: "",
        description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pas de persistance réelle cette session (données mock) : on revient juste à la liste.
        navigate("/admin/events");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to="/admin/events"
                className="inline-flex items-center gap-2 text-[#3B82F6] hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour à la gestion
            </Link>

            <div className="mb-8">
                <h1>Créer un Événement</h1>
                <p className="text-gray-600 mt-2">
                    Remplissez les informations pour créer un nouvel événement
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-2">
                            Nom de l'événement *
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ex: Concert de Jazz"
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Heure *</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Lieu *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Ex: Salle Pleyel, Paris"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Places disponibles *</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    value={formData.maxCapacity}
                                    onChange={handleChange}
                                    placeholder="Ex: 200"
                                    min={1}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Décrivez votre événement..."
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Image de l'événement</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#3B82F6] transition-colors cursor-pointer">
                            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-1">
                                Cliquez pour télécharger une image
                            </p>
                            <p className="text-sm text-gray-400">
                                PNG, JPG jusqu'à 10MB
                            </p>
                            <input type="file" className="hidden" accept="image/*" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors shadow-lg"
                        >
                            Créer l'événement
                        </button>
                        <Link
                            to="/admin/events"
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-center hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
