import { Calendar, Users, UserCheck, Clock, BarChart3 } from "lucide-react";
import { events } from "../../mocks/events";
import { formatDate } from "../../utils/format";

export default function AdminDashboard() {
    const upcomingEvents = events.filter((event) => event.status === "published").slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1>Dashboard Administrateur</h1>
                <p className="text-gray-600 mt-2">
                    Vue d'ensemble de vos événements et statistiques
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#3B82F6]" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Total Événements</p>
                    <h2 className="text-[#3B82F6]">{events.length}</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Utilisateurs</p>
                    <h2 className="text-purple-500">1,247</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Total Inscrits</p>
                    <h2 className="text-green-500">
                        {events.reduce((sum, event) => sum + event.activeRegistered, 0)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Événements à venir</p>
                    <h2 className="text-orange-500">
                        {events.filter((event) => event.status === "published").length}
                    </h2>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                <h2 className="mb-6">Événements à venir</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-gray-600">Événement</th>
                                <th className="text-left py-3 px-4 text-gray-600">Date</th>
                                <th className="text-left py-3 px-4 text-gray-600">Inscrits</th>
                                <th className="text-left py-3 px-4 text-gray-600">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingEvents.map((event) => (
                                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-gray-800">{event.title}</td>
                                    <td className="py-4 px-4 text-gray-600">{formatDate(event.startDate)}</td>
                                    <td className="py-4 px-4 text-gray-600">{event.activeRegistered}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            À venir
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white">
                    <Calendar className="w-8 h-8 mb-3 opacity-90" />
                    <h3 className="mb-2">Créer un événement</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Ajoutez un nouvel événement rapidement
                    </p>
                    <button className="px-4 py-2 bg-white text-[#3B82F6] rounded-lg hover:bg-gray-100 transition-colors">
                        Nouveau
                    </button>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <Users className="w-8 h-8 mb-3 opacity-90" />
                    <h3 className="mb-2">Gérer les invités</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Consultez et modifiez vos invités
                    </p>
                    <button className="px-4 py-2 bg-white text-purple-500 rounded-lg hover:bg-gray-100 transition-colors">
                        Accéder
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <BarChart3 className="w-8 h-8 mb-3 opacity-90" />
                    <h3 className="mb-2">Voir les stats</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Analysez vos performances
                    </p>
                    <button className="px-4 py-2 bg-white text-green-500 rounded-lg hover:bg-gray-100 transition-colors">
                        Consulter
                    </button>
                </div>
            </div>
        </div>
    );
}
