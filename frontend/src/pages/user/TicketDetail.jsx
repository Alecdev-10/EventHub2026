import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User, Ticket, Download, CheckCircle, XCircle } from "lucide-react";
import { getTicketById } from "../../mocks/tickets";
import { formatDate, formatTime, ticketStatusLabels } from "../../utils/format";
import { useAuth } from "../../contexts/AuthContext";

export default function UserTicketDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const ticket = getTicketById(id);

    if (!ticket) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-gray-500">Billet introuvable.</p>
                <Link to="/user/tickets" className="text-[#3B82F6] hover:underline">
                    Retour à mes billets
                </Link>
            </div>
        );
    }

    const isValid = ticket.status === "confirmed";

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to="/user/tickets"
                className="inline-flex items-center gap-2 text-[#3B82F6] hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour à mes billets
            </Link>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-8 text-white">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <Ticket className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Billet d'entrée</p>
                                <p className="text-xs opacity-75 mt-1">{ticket.ticketNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isValid ? (
                                <span className="px-4 py-2 bg-green-500 bg-opacity-90 rounded-lg flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    {ticketStatusLabels[ticket.status]}
                                </span>
                            ) : (
                                <span className="px-4 py-2 bg-gray-500 bg-opacity-90 rounded-lg flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    {ticketStatusLabels[ticket.status]}
                                </span>
                            )}
                        </div>
                    </div>
                    <h1 className="mb-3">{ticket.eventTitle}</h1>
                    <p className="opacity-90">Présentez ce billet à l'entrée de l'événement</p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4">Informations de l'événement</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-[#3B82F6] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Date et heure</p>
                                            <p className="text-gray-800">{formatDate(ticket.generatedAt)}</p>
                                            <p className="text-gray-800">{formatTime(ticket.generatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-[#3B82F6] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Lieu</p>
                                            <p className="text-gray-800">{ticket.eventLocation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4">Informations du participant</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-[#3B82F6] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Nom</p>
                                            <p className="text-gray-800">
                                                {user ? `${user.firstName} ${user.name}` : "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Ticket className="w-5 h-5 text-[#3B82F6] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Numéro de billet</p>
                                            <p className="text-gray-800 font-mono">{ticket.ticketNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4">Code QR</h3>
                            <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white">
                                <p className="text-sm text-center opacity-90 mb-4">
                                    Présentez ce code à l'entrée
                                </p>
                                <div className="bg-white rounded-lg p-6">
                                    <svg viewBox="0 0 200 200" className="w-full h-full">
                                        <rect x="0" y="0" width="200" height="200" fill="white" />
                                        <rect x="10" y="10" width="50" height="50" fill="black" />
                                        <rect x="20" y="20" width="30" height="30" fill="white" />
                                        <rect x="25" y="25" width="20" height="20" fill="black" />

                                        <rect x="140" y="10" width="50" height="50" fill="black" />
                                        <rect x="150" y="20" width="30" height="30" fill="white" />
                                        <rect x="155" y="25" width="20" height="20" fill="black" />

                                        <rect x="10" y="140" width="50" height="50" fill="black" />
                                        <rect x="20" y="150" width="30" height="30" fill="white" />
                                        <rect x="25" y="155" width="20" height="20" fill="black" />

                                        <rect x="70" y="30" width="10" height="10" fill="black" />
                                        <rect x="90" y="30" width="10" height="10" fill="black" />
                                        <rect x="110" y="30" width="10" height="10" fill="black" />

                                        <rect x="70" y="70" width="60" height="60" fill="black" />
                                        <rect x="80" y="80" width="40" height="40" fill="white" />
                                        <rect x="90" y="90" width="20" height="20" fill="black" />

                                        <rect x="150" y="70" width="10" height="10" fill="black" />
                                        <rect x="170" y="70" width="10" height="10" fill="black" />

                                        <rect x="30" y="170" width="10" height="10" fill="black" />
                                        <rect x="70" y="150" width="10" height="10" fill="black" />
                                        <rect x="90" y="150" width="10" height="10" fill="black" />
                                        <rect x="110" y="150" width="10" height="10" fill="black" />
                                        <rect x="130" y="150" width="10" height="10" fill="black" />
                                        <rect x="150" y="150" width="10" height="10" fill="black" />
                                        <rect x="170" y="150" width="10" height="10" fill="black" />
                                        <rect x="150" y="170" width="10" height="10" fill="black" />
                                        <rect x="170" y="170" width="10" height="10" fill="black" />
                                    </svg>
                                </div>
                                <p className="text-xs text-center opacity-75 mt-4">
                                    Code: {ticket.qrCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="text-[#3B82F6] mb-2">Informations importantes</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Arrivez 30 minutes avant le début de l'événement</li>
                            <li>• Présentez ce billet sur votre téléphone ou imprimé</li>
                            <li>• Le billet est valable pour une seule entrée</li>
                            <li>• Une pièce d'identité pourra être demandée</li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors shadow-lg">
                            <Download className="w-5 h-5" />
                            Télécharger le billet
                        </button>
                        <button className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Partager
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
