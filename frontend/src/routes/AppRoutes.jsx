import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ContactPage from "../pages/Contact";

import UserLayout from "../layouts/UserLayout";
import ScanAgentLayout from "../layouts/ScanAgentLayout";

const UserDashboard = lazy(() => import("../pages/user/Dashboard"));
const EventsList = lazy(() => import("../pages/user/EventsList"));
const EventDetails = lazy(() => import("../pages/user/EventDetails"));
const UserTickets = lazy(() => import("../pages/user/Tickets"));
const UserTicketDetail = lazy(() => import("../pages/user/TicketDetail"));
const Invitations = lazy(() => import("../pages/user/Invitations"));
const Profile = lazy(() => import("../pages/user/Profile"));

const ScanAgentDashboard = lazy(() => import("../pages/scan-agent/Dashboard"));
const ScanAgentEvents = lazy(() => import("../pages/scan-agent/Events"));
const ScanAgentScanner = lazy(() => import("../pages/scan-agent/Scanner"));

export default function AppRoutes() {
    return (
        <Suspense fallback={<div role="status" className="mx-auto max-w-7xl rounded-lg border border-border bg-surface px-6 py-10 text-center text-sm text-ink-muted">Ouverture de votre espace…</div>}>
        <Routes>
            <Route path="/login" caseSensitive element={<LoginPage />} />
            <Route path="/register" caseSensitive element={<RegisterPage />} />
            <Route path="/contact" caseSensitive element={<ContactPage />} />
            <Route path="/Login" caseSensitive element={<Navigate to="/login" replace />} />
            <Route path="/Register" caseSensitive element={<Navigate to="/register" replace />} />

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

            <Route element={<ProtectedRoute roles={["scanAgent"]} />}>
                <Route path="/scan-agent" element={<ScanAgentLayout />}>
                    <Route index element={<ScanAgentDashboard />} />
                    <Route path="events" element={<ScanAgentEvents />} />
                    <Route path="scanner" element={<ScanAgentScanner />} />
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </Suspense>
    );
}
