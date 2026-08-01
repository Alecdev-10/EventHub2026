import { useState } from "react";
import { Camera, CheckCircle, XCircle, AlertCircle, Scan, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Scanner 100% simulé cette session (pas de vraie caméra/lib QR).
// TODO session câblage backend: remplacer par html5-qrcode (ou équivalent) + appel API réel de check-in.
export default function ScanAgentScanner() {
    const [scanResult, setScanResult] = useState({ type: null });
    const [isScanning, setIsScanning] = useState(true);

    const simulateScan = (type) => {
        setIsScanning(false);
        const now = new Date().toLocaleTimeString("fr-FR");

        if (type === "valid") {
            setScanResult({ type: "valid", guestName: "Marie Dubois", eventName: "Concert de Jazz", scanTime: now });
        } else if (type === "used") {
            setScanResult({ type: "used", guestName: "Pierre Martin", eventName: "Concert de Jazz", scanTime: "18:45:32" });
        } else {
            setScanResult({ type: "invalid", guestName: "Code invalide" });
        }

        setTimeout(() => {
            setScanResult({ type: null });
            setIsScanning(true);
        }, 4000);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Link
                to="/scan-agent"
                className="inline-flex items-center gap-2 text-[#3B82F6] hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour au dashboard
            </Link>

            <div className="mb-8">
                <h1>Scanner QR Code</h1>
                <p className="text-gray-600 mt-2">Validez les billets à l'entrée</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3>Zone de scan</h3>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                                <span className="text-sm text-gray-600">
                                    {isScanning ? "Prêt à scanner" : "Traitement..."}
                                </span>
                            </div>
                        </div>

                        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-6">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Camera className="w-20 h-20 text-white opacity-20" />
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-80 h-80 border-4 border-[#3B82F6] rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg" />
                                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg" />
                                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg" />

                                    {isScanning && (
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B82F6] animate-pulse" />
                                    )}
                                </div>
                            </div>

                            {scanResult.type && (
                                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                                    {scanResult.type === "valid" && (
                                        <div className="text-center text-white p-8">
                                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="w-16 h-16" />
                                            </div>
                                            <h2 className="mb-4">Billet Valide ✓</h2>
                                            <div className="space-y-2 text-lg">
                                                <p className="text-green-400">{scanResult.guestName}</p>
                                                <p className="opacity-90">{scanResult.eventName}</p>
                                                <p className="text-sm opacity-75">Heure d'entrée: {scanResult.scanTime}</p>
                                            </div>
                                        </div>
                                    )}

                                    {scanResult.type === "used" && (
                                        <div className="text-center text-white p-8">
                                            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <AlertCircle className="w-16 h-16" />
                                            </div>
                                            <h2 className="mb-4">Billet Déjà Utilisé</h2>
                                            <div className="space-y-2 text-lg">
                                                <p className="text-orange-400">{scanResult.guestName}</p>
                                                <p className="opacity-90">{scanResult.eventName}</p>
                                                <p className="text-sm opacity-75">Première entrée: {scanResult.scanTime}</p>
                                            </div>
                                        </div>
                                    )}

                                    {scanResult.type === "invalid" && (
                                        <div className="text-center text-white p-8">
                                            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <XCircle className="w-16 h-16" />
                                            </div>
                                            <h2 className="mb-4">Code Invalide</h2>
                                            <p className="text-sm opacity-75">Ce QR code n'est pas reconnu</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                                <Scan className="w-5 h-5" />
                                <p>Positionnez le QR code dans le cadre</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <p className="text-sm text-gray-500 mb-3">Mode Démo - Simuler un scan :</p>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => simulateScan("valid")}
                                    disabled={!isScanning}
                                    className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Billet valide
                                </button>
                                <button
                                    onClick={() => simulateScan("used")}
                                    disabled={!isScanning}
                                    className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Déjà utilisé
                                </button>
                                <button
                                    onClick={() => simulateScan("invalid")}
                                    disabled={!isScanning}
                                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-800">Validés</span>
                                </div>
                                <span className="text-green-600">87</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                    <span className="text-gray-800">Doublons</span>
                                </div>
                                <span className="text-orange-600">12</span>
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
                                { name: "Marie Dubois", time: "Il y a 1 min", type: "valid" },
                                { name: "Pierre Martin", time: "Il y a 3 min", type: "used" },
                                { name: "Sophie Laurent", time: "Il y a 5 min", type: "valid" },
                                { name: "Code invalide", time: "Il y a 8 min", type: "invalid" },
                                { name: "Jean Dupont", time: "Il y a 12 min", type: "valid" },
                            ].map((scan, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">{scan.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{scan.time}</p>
                                    </div>
                                    {scan.type === "valid" && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                    {scan.type === "used" && (
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                    )}
                                    {scan.type === "invalid" && (
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
