import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Calendar, CheckCircle } from "lucide-react";
import { participantsData, invitationsData, presenceData } from "../../mocks/stats";

export default function Statistics() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1>Statistiques</h1>
                <p className="text-gray-600 mt-2">
                    Analysez les performances de vos événements
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <span className="text-sm text-green-500">+12%</span>
                    </div>
                    <p className="text-sm text-gray-500">Taux de croissance</p>
                    <h3 className="text-[#3B82F6] mt-1">85%</h3>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-sm text-green-500">+8%</span>
                    </div>
                    <p className="text-sm text-gray-500">Total participants</p>
                    <h3 className="text-purple-500 mt-1">1,530</h3>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-500" />
                        </div>
                        <span className="text-sm text-green-500">+15%</span>
                    </div>
                    <p className="text-sm text-gray-500">Événements réalisés</p>
                    <h3 className="text-orange-500 mt-1">24</h3>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-sm text-green-500">+10%</span>
                    </div>
                    <p className="text-sm text-gray-500">Taux de présence</p>
                    <h3 className="text-green-500 mt-1">92%</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="mb-6">Évolution des participants</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={participantsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="participants" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="mb-6">Invitations envoyées vs acceptées</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={invitationsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="envoyées"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={{ fill: "#F59E0B", r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="acceptées"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ fill: "#10B981", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="mb-6">Taux de présence global</h3>
                <div className="flex items-center gap-8">
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={presenceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {presenceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-4">
                        {presenceData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-800">{item.name}</span>
                                </div>
                                <span className="text-gray-600">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
