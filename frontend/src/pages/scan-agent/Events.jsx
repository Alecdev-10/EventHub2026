import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, QrCode, Clock } from "lucide-react";
import { events } from "../../mocks/events";
import { formatDate, formatTime } from "../../utils/format";

// Progression de scan simulée par événement (le vrai check-in sera câblé sur l'API plus tard).
const scanProgress = { 1: 87, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

export default function ScanAgentEvents() {
    const assignedEvents = events
        .filter((event) => event.status === "published")
        .map((event) => {
            const scanned = scanProgress[event.id] ?? 0;
            return {
                ...event,
                scanned,
                pending: event.activeRegistered - scanned,
                inProgress: scanned > 0 && scanned < event.activeRegistered,
            };
        });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1>Mes Événements</h1>
                <p className="text-gray-600 mt-2">
                    Liste des événements dont vous assurez le contrôle d'accès
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {assignedEvents.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-[#3B82F6] rounded-xl flex items-center justify-center text-white">
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-gray-800 mb-2">{event.title}</h2>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDate(event.startDate)} • {formatTime(event.startDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>{event.activeRegistered} participants attendus</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`px-4 py-2 rounded-lg text-sm ${
                                    event.inProgress
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {event.inProgress ? "En cours" : "À venir"}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Scannés</p>
                                    <p className="text-2xl text-green-600">{event.scanned}</p>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">En attente</p>
                                    <p className="text-2xl text-orange-600">{event.pending}</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Taux</p>
                                    <p className="text-2xl text-[#3B82F6]">
                                        {Math.round((event.scanned / event.activeRegistered) * 100)}%
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/scan-agent/scanner"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                            >
                                <QrCode className="w-5 h-5" />
                                Scanner les billets
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
