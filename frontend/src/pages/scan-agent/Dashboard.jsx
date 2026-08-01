import { Link } from "react-router-dom";
import { QrCode, Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { events } from "../../mocks/events";
import { formatDate, formatTime } from "../../utils/format";

const scanProgress = { 1: 87, 2: 0, 3: 0 };

export default function ScanAgentDashboard() {
    const assignedEvents = events
        .filter((event) => event.status === "published")
        .slice(0, 3)
        .map((event) => {
            const scanned = scanProgress[event.id] ?? 0;
            return { ...event, scanned, inProgress: scanned > 0 && scanned < event.activeRegistered };
        });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1>Dashboard Agent</h1>
                <p className="text-gray-600 mt-2">Gérez vos scans et événements assignés</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#3B82F6]" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Événements assignés</p>
                    <h2 className="text-[#3B82F6]">{assignedEvents.length}</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Scans aujourd'hui</p>
                    <h2 className="text-green-500">87</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">En attente</p>
                    <h2 className="text-orange-500">63</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Taux de présence</p>
                    <h2 className="text-purple-500">58%</h2>
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-2">Scanner un ticket</h2>
                        <p className="opacity-90">Accédez rapidement au scanner QR</p>
                    </div>
                    <Link
                        to="/scan-agent/scanner"
                        className="flex items-center gap-3 px-8 py-4 bg-white text-[#3B82F6] rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        <QrCode className="w-6 h-6" />
                        <span>Ouvrir le scanner</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="mb-6">Événements assignés</h2>
                <div className="space-y-4">
                    {assignedEvents.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-[#3B82F6] rounded-lg flex items-center justify-center text-white">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-gray-800">{event.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(event.startDate)} • {formatTime(event.startDate)} • {event.location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Scannés</p>
                                    <p className="text-[#3B82F6]">
                                        {event.scanned} / {event.activeRegistered}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        event.inProgress
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {event.inProgress ? "En cours" : "À venir"}
                                </span>
                                <Link
                                    to="/scan-agent/scanner"
                                    className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Scanner
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
