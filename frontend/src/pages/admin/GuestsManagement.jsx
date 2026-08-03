import { Search, QrCode, Mail, UserPlus } from "lucide-react";
import { guests } from "../../mocks/guests";

export default function GuestsManagement() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1>Gestion des Invités</h1>
                    <p className="text-gray-600 mt-2">
                        Gérez tous vos invités et leurs inscriptions
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors shadow-lg">
                    <UserPlus className="w-5 h-5" />
                    Ajouter un invité
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un invité par nom ou email..."
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-6 text-gray-600">Nom</th>
                                <th className="text-left py-4 px-6 text-gray-600">Email</th>
                                <th className="text-left py-4 px-6 text-gray-600">Événement</th>
                                <th className="text-left py-4 px-6 text-gray-600">Statut</th>
                                <th className="text-left py-4 px-6 text-gray-600">QR Code</th>
                                <th className="text-left py-4 px-6 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white">
                                                {guest.name.charAt(0)}
                                            </div>
                                            <span className="text-gray-800">{guest.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            {guest.email}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{guest.event}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                guest.status === "Confirmé"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}
                                        >
                                            {guest.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <QrCode className="w-4 h-4" />
                                            {guest.qrCode}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button className="px-4 py-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
                                            <QrCode className="w-4 h-4" />
                                            Voir QR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Affichage de 1 à {guests.length} sur {guests.length} invités
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        Précédent
                    </button>
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg">
                        1
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}
