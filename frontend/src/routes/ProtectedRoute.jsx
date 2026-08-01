import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ roles }) {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/Login" replace />;
    }

    return <Outlet />;
}
