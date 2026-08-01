import { Link } from "react-router-dom";
import { Ticket, Calendar, MapPin, Download, Eye } from "lucide-react";
import { tickets } from "../../mocks/tickets";
import { formatDate, formatTime, ticketStatusLabels } from "../../utils/format";

export default function UserTickets() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1>Mes Billets</h1>
                <p className="text-gray-600 mt-2">
                    Tous vos billets d'événements en un seul endroit
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-6 text-white">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Ticket className="w-6 h-6" />
                                    <div>
                                        <p className="text-sm opacity-90">Billet d'entrée</p>
                                        <p className="text-xs opacity-75 mt-1">{ticket.ticketNumber}</p>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        ticket.status === "confirmed"
                                            ? "bg-green-500 bg-opacity-90"
                                            : "bg-gray-500 bg-opacity-90"
                                    }`}
                                >
                                    {ticketStatusLabels[ticket.status]}
                                </span>
                            </div>
                            <h3 className="mb-2">{ticket.eventTitle}</h3>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-[#3B82F6]" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date et heure</p>
                                        <p className="text-gray-800">
                                            {formatDate(ticket.generatedAt)} • {formatTime(ticket.generatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-[#3B82F6]" />
                                    <div>
                                        <p className="text-sm text-gray-500">Lieu</p>
                                        <p className="text-gray-800">{ticket.eventLocation}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="w-24 h-24 mx-auto bg-white rounded-lg flex items-center justify-center">
                                    <svg viewBox="0 0 120 120" className="w-full h-full p-2">
                                        <rect x="0" y="0" width="120" height="120" fill="white" />
                                        <rect x="10" y="10" width="30" height="30" fill="black" />
                                        <rect x="80" y="10" width="30" height="30" fill="black" />
                                        <rect x="10" y="80" width="30" height="30" fill="black" />
                                        <rect x="50" y="20" width="8" height="8" fill="black" />
                                        <rect x="65" y="20" width="8" height="8" fill="black" />
                                        <rect x="50" y="50" width="30" height="30" fill="black" />
                                        <rect x="55" y="55" width="20" height="20" fill="white" />
                                        <rect x="85" y="50" width="8" height="8" fill="black" />
                                        <rect x="20" y="100" width="8" height="8" fill="black" />
                                        <rect x="50" y="90" width="8" height="8" fill="black" />
                                        <rect x="65" y="90" width="8" height="8" fill="black" />
                                        <rect x="85" y="90" width="8" height="8" fill="black" />
                                        <rect x="100" y="90" width="8" height="8" fill="black" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    to={`/user/tickets/${ticket.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    Afficher
                                </Link>
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#3B82F6] text-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors">
                                    <Download className="w-4 h-4" />
                                    Télécharger
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-800 mb-2">Aucun billet</h3>
                    <p className="text-gray-500 mb-6">
                        Vous n'avez pas encore de billets. Inscrivez-vous à un événement pour recevoir votre billet.
                    </p>
                    <Link
                        to="/user/events"
                        className="inline-block px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        Voir les événements
                    </Link>
                </div>
            )}
        </div>
    );
}
