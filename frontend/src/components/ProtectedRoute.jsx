import { Navigate } from "react-router-dom";
import { auth, getUserRole } from "../api/client";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const loggedIn = !!auth.getToken();
    const role = getUserRole();

    if (!loggedIn) return <Navigate to="/login" />;
    if (adminOnly && role !== "ADMIN") return <Navigate to="/" />;

    return children;
}