import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { getEventById } from "../../mocks/events";
import { formatDate, formatTime } from "../../utils/format";

const attendees = [
    { name: "Marie Dubois", status: "Confirmé" },
    { name: "Pierre Martin", status: "Confirmé" },
    { name: "Sophie Laurent", status: "En attente" },
    { name: "Jean Dupont", status: "Confirmé" },
    { name: "Emma Bernard", status: "Confirmé" },
];

export default function EventDetails() {
    const { id } = useParams();
    const event = getEventById(id);

    if (!event) {
        return (
            <div className="max-w-5xl mx-auto text-center py-12">
                <p className="text-gray-500">Événement introuvable.</p>
                <Link to="/user/events" className="text-[#3B82F6] hover:underline">
                    Retour aux événements
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link
                to="/user/events"
                className="inline-flex items-center gap-2 text-[#3B82F6] hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux événements
            </Link>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-6">
                <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-80 object-cover"
                />
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="mb-4">{event.title}</h1>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                    <span>{formatDate(event.startDate)} à {formatTime(event.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="w-5 h-5" />
                                    <span>{event.activeRegistered} / {event.maxCapacity} participants</span>
                                </div>
                            </div>
                        </div>
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Inscrit
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="mb-4">Liste des participants</h3>
                    <div className="space-y-3">
                        {attendees.map((attendee, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white">
                                        {attendee.name.charAt(0)}
                                    </div>
                                    <span className="text-gray-800">{attendee.name}</span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        attendee.status === "Confirmé"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-orange-100 text-orange-700"
                                    }`}
                                >
                                    {attendee.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="mb-4">Votre billet</h3>
                    <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90 mb-2">Événement</p>
                        <h4 className="mb-4">{event.title}</h4>
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg viewBox="0 0 200 200" className="w-full h-full p-2">
                                    <rect x="0" y="0" width="200" height="200" fill="white" />
                                    <rect x="10" y="10" width="50" height="50" fill="black" />
                                    <rect x="140" y="10" width="50" height="50" fill="black" />
                                    <rect x="10" y="140" width="50" height="50" fill="black" />
                                    <rect x="70" y="30" width="10" height="10" fill="black" />
                                    <rect x="90" y="30" width="10" height="10" fill="black" />
                                    <rect x="110" y="30" width="10" height="10" fill="black" />
                                    <rect x="70" y="70" width="60" height="60" fill="black" />
                                    <rect x="80" y="80" width="40" height="40" fill="white" />
                                    <rect x="150" y="70" width="10" height="10" fill="black" />
                                    <rect x="170" y="70" width="10" height="10" fill="black" />
                                    <rect x="30" y="170" width="10" height="10" fill="black" />
                                    <rect x="70" y="150" width="10" height="10" fill="black" />
                                    <rect x="90" y="150" width="10" height="10" fill="black" />
                                    <rect x="110" y="150" width="10" height="10" fill="black" />
                                    <rect x="130" y="150" width="10" height="10" fill="black" />
                                    <rect x="150" y="150" width="10" height="10" fill="black" />
                                    <rect x="170" y="150" width="10" height="10" fill="black" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-center opacity-90">
                            Présentez ce QR code à l'entrée
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
