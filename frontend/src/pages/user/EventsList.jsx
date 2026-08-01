import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { events } from "../../mocks/events";
import { formatDate, eventStatusLabels } from "../../utils/format";

export default function EventsList() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1>Tous les Événements</h1>
                <p className="text-gray-600 mt-2">Découvrez et participez aux événements disponibles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <ImageWithFallback
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-gray-800">{event.title}</h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        event.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {eventStatusLabels[event.status]}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(event.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>{event.activeRegistered} / {event.maxCapacity} inscrits</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to={`/user/events/${event.id}`}
                                    className="flex-1 px-4 py-2 border border-[#3B82F6] text-[#3B82F6] rounded-lg text-center hover:bg-blue-50 transition-colors"
                                >
                                    Voir détails
                                </Link>
                                <button className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
                                    Participer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
