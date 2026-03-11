import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { UserRole } from "@/data/mock-users";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, allowedRoles, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, currentRole } = useStore();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Redirect to appropriate dashboard based on role
    if (currentRole === "admin") return <Navigate to="/admin" replace />;
    if (currentRole === "vendor") return <Navigate to="/vendor" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
