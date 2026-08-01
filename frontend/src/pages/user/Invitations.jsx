import { Calendar, MapPin, Check, X } from "lucide-react";

const invitations = [
    { id: 1, event: "Festival d'été", date: "5 Juin 2026", location: "Marseille, France", organizer: "EventFlow Team", status: "En attente" },
    { id: 2, event: "Gala de charité", date: "20 Mai 2026", location: "Nice, France", organizer: "Association Soleil", status: "En attente" },
    { id: 3, event: "Soirée networking", date: "12 Avril 2026", location: "Paris, France", organizer: "Business Club", status: "En attente" },
    { id: 4, event: "Concert classique", date: "8 Juin 2026", location: "Lyon, France", organizer: "Orchestre National", status: "En attente" },
];

export default function Invitations() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1>Mes Invitations</h1>
                <p className="text-gray-600 mt-2">
                    Gérez vos invitations aux événements
                </p>
            </div>

            <div className="space-y-4">
                {invitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-gray-800 mb-3">{invitation.event}</h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{invitation.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{invitation.location}</span>
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        Organisé par <span className="text-[#3B82F6]">{invitation.organizer}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Accepter
                                    </button>
                                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <X className="w-4 h-4" />
                                        Refuser
                                    </button>
                                </div>
                            </div>

                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                {invitation.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
