import { Link } from "react-router-dom";
import { Calendar, Mail, CheckCircle, ArrowRight } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { events } from "../../mocks/events";
import { formatDate } from "../../utils/format";

const recentInvitations = [
    { name: "Festival d'été", date: "5 Juin 2026", status: "En attente" },
    { name: "Gala de charité", date: "20 Mai 2026", status: "En attente" },
];

export default function UserDashboard() {
    const upcomingEvents = events.filter((event) => event.status === "published").slice(0, 2);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1>Mon Dashboard</h1>
                <p className="text-gray-600 mt-2">Aperçu de vos événements et invitations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#3B82F6]" />
                        </div>
                    </div>
                    <h3 className="text-gray-800">Événements à venir</h3>
                    <p className="text-3xl text-[#3B82F6] mt-2">5</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <h3 className="text-gray-800">Invitations reçues</h3>
                    <p className="text-3xl text-orange-500 mt-2">3</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <h3 className="text-gray-800">Événements confirmés</h3>
                    <p className="text-3xl text-green-500 mt-2">8</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2>Événements à venir</h2>
                    <Link
                        to="/user/events"
                        className="flex items-center gap-2 text-[#3B82F6] hover:underline"
                    >
                        Voir tous
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ImageWithFallback
                                src={event.image}
                                alt={event.title}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h4 className="text-gray-800">{event.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatDate(event.startDate)} • {event.location}
                                </p>
                            </div>
                            <Link
                                to={`/user/events/${event.id}`}
                                className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                            >
                                Détails
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2>Invitations récentes</h2>
                    <Link
                        to="/user/invitations"
                        className="flex items-center gap-2 text-[#3B82F6] hover:underline"
                    >
                        Voir toutes
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentInvitations.map((invitation, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div>
                                <h4 className="text-gray-800">{invitation.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{invitation.date}</p>
                            </div>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                {invitation.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
