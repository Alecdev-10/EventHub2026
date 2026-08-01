import { useState } from "react";
import { Camera, CheckCircle, XCircle, AlertCircle, Scan } from "lucide-react";

// Scanner 100% simulé cette session (pas de vraie caméra/lib QR).
// TODO session câblage backend: remplacer par html5-qrcode (ou équivalent) + appel API réel de check-in.
export default function QRScanner() {
    const [scanResult, setScanResult] = useState(null);
    const [guestName, setGuestName] = useState("");

    const simulateScan = (type) => {
        setScanResult(type);
        if (type === "valid") {
            setGuestName("Marie Dubois");
        } else if (type === "duplicate") {
            setGuestName("Pierre Martin");
        } else {
            setGuestName("Code invalide");
        }

        setTimeout(() => {
            setScanResult(null);
            setGuestName("");
        }, 3000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1>Scanner QR Code</h1>
                <p className="text-gray-600 mt-2">
                    Scannez les QR codes des invités à l'entrée
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="mb-4">Caméra de scan</h3>

                        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-4">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Camera className="w-16 h-16 text-white opacity-20" />
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-4 border-[#3B82F6] rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B82F6] animate-pulse" />
                                </div>
                            </div>

                            {scanResult && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                                    {scanResult === "valid" && (
                                        <div className="text-center text-white">
                                            <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-400" />
                                            <h2 className="mb-2">Invité Valide</h2>
                                            <p className="text-xl">{guestName}</p>
                                        </div>
                                    )}
                                    {scanResult === "duplicate" && (
                                        <div className="text-center text-white">
                                            <AlertCircle className="w-20 h-20 mx-auto mb-4 text-orange-400" />
                                            <h2 className="mb-2">Déjà Enregistré</h2>
                                            <p className="text-xl">{guestName}</p>
                                            <p className="text-sm mt-2 opacity-80">Entrée déjà validée</p>
                                        </div>
                                    )}
                                    {scanResult === "invalid" && (
                                        <div className="text-center text-white">
                                            <XCircle className="w-20 h-20 mx-auto mb-4 text-red-400" />
                                            <h2 className="mb-2">Code Invalide</h2>
                                            <p className="text-sm mt-2 opacity-80">QR code non reconnu</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-center text-gray-600 mb-4 flex items-center justify-center gap-2">
                            <Scan className="w-5 h-5" />
                            Positionnez le QR code face à la caméra
                        </p>

                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm text-gray-500 mb-3">Mode Démo - Simuler un scan :</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => simulateScan("valid")}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Invité valide
                                </button>
                                <button
                                    onClick={() => simulateScan("duplicate")}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Déjà enregistré
                                </button>
                                <button
                                    onClick={() => simulateScan("invalid")}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Code invalide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="mb-4">Statistiques du jour</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-800">Validés</span>
                                </div>
                                <span className="text-green-600">127</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                    <span className="text-gray-800">Doublons</span>
                                </div>
                                <span className="text-orange-600">8</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-gray-800">Invalides</span>
                                </div>
                                <span className="text-red-600">3</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="mb-4">Derniers scans</h3>
                        <div className="space-y-3">
                            {[
                                { name: "Marie Dubois", time: "Il y a 2 min", status: "valid" },
                                { name: "Pierre Martin", time: "Il y a 5 min", status: "duplicate" },
                                { name: "Sophie Laurent", time: "Il y a 8 min", status: "valid" },
                                { name: "Code invalide", time: "Il y a 12 min", status: "invalid" },
                            ].map((scan, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">{scan.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{scan.time}</p>
                                    </div>
                                    {scan.status === "valid" && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                    {scan.status === "duplicate" && (
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                    )}
                                    {scan.status === "invalid" && (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
