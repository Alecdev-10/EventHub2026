import { User, Mail, Phone, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const roleLabels = {
    superAdmin: "Super administrateur",
    eventManager: "Organisateur",
    scanAgent: "Agent de scan",
    participant: "Participant",
};

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1>Mon Profil</h1>
                <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center text-white mb-4">
                                <User className="w-12 h-12" />
                            </div>
                            <h3 className="text-gray-800 mb-1">
                                {user ? `${user.firstName} ${user.name}` : "—"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {roleLabels[user?.role] ?? "Utilisateur"}
                            </p>
                            <button className="w-full px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
                                Modifier la photo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3>Informations personnelles</h3>
                            <button className="flex items-center gap-2 px-4 py-2 text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors">
                                <Settings className="w-4 h-4" />
                                Modifier
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                                    <p className="text-gray-800">
                                        {user ? `${user.firstName} ${user.name}` : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-800">{user?.email ?? "—"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                                    <p className="text-gray-800">{user?.telephone ?? "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="mb-4">Préférences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-gray-800">Notifications par email</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Recevoir les notifications d'événements
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#3B82F6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-gray-800">Notifications push</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Recevoir les notifications en temps réel
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#3B82F6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
