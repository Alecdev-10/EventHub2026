import { Route, Routes, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ScanAgentLayout from "../layouts/ScanAgentLayout";

import UserDashboard from "../pages/user/Dashboard";
import EventsList from "../pages/user/EventsList";
import EventDetails from "../pages/user/EventDetails";
import UserTickets from "../pages/user/Tickets";
import UserTicketDetail from "../pages/user/TicketDetail";
import Invitations from "../pages/user/Invitations";
import Profile from "../pages/user/Profile";

import AdminDashboard from "../pages/admin/Dashboard";
import EventsManagement from "../pages/admin/EventsManagement";
import CreateEvent from "../pages/admin/CreateEvent";
import GuestsManagement from "../pages/admin/GuestsManagement";
import Statistics from "../pages/admin/Statistics";
import QRScanner from "../pages/admin/QRScanner";

import ScanAgentDashboard from "../pages/scan-agent/Dashboard";
import ScanAgentEvents from "../pages/scan-agent/Events";
import ScanAgentScanner from "../pages/scan-agent/Scanner";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute roles={["participant"]} />}>
                <Route path="/user" element={<UserLayout />}>
                    <Route index element={<UserDashboard />} />
                    <Route path="events" element={<EventsList />} />
                    <Route path="events/:id" element={<EventDetails />} />
                    <Route path="tickets" element={<UserTickets />} />
                    <Route path="tickets/:id" element={<UserTicketDetail />} />
                    <Route path="invitations" element={<Invitations />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute roles={["superAdmin", "eventManager"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="events" element={<EventsManagement />} />
                    <Route path="events/new" element={<CreateEvent />} />
                    <Route path="guests" element={<GuestsManagement />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="scanner" element={<QRScanner />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute roles={["scanAgent"]} />}>
                <Route path="/scan-agent" element={<ScanAgentLayout />}>
                    <Route index element={<ScanAgentDashboard />} />
                    <Route path="events" element={<ScanAgentEvents />} />
                    <Route path="scanner" element={<ScanAgentScanner />} />
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/Login" replace />} />
            <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
    );
}
