import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Calendar, MapPin } from "lucide-react";
import { events } from "../../mocks/events";
import { formatDate, eventStatusLabels } from "../../utils/format";

export default function EventsManagement() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1>Gestion des Événements</h1>
                    <p className="text-gray-600 mt-2">
                        Gérez tous vos événements en un seul endroit
                    </p>
                </div>
                <Link
                    to="/admin/events/new"
                    className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Créer un événement
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-6 text-gray-600">Nom</th>
                                <th className="text-left py-4 px-6 text-gray-600">Date</th>
                                <th className="text-left py-4 px-6 text-gray-600">Lieu</th>
                                <th className="text-left py-4 px-6 text-gray-600">Inscrits</th>
                                <th className="text-left py-4 px-6 text-gray-600">Statut</th>
                                <th className="text-left py-4 px-6 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center text-white">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <span className="text-gray-800">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{formatDate(event.startDate)}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {event.activeRegistered} / {event.maxCapacity}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                event.status === "published"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {eventStatusLabels[event.status]}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
