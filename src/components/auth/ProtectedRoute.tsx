import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import type { UserRole } from "@/features/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, allowedRoles, requireAuth = true }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const currentRole = useAuthStore(s => s.currentRole);
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    if (currentRole === "admin") return <Navigate to="/admin" replace />;
    if (currentRole === "vendor") return <Navigate to="/vendor" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ── Convenience route guards ──────────────────────────────────────────────

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}

export function VendorRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["vendor", "admin"]}>{children}</ProtectedRoute>;
}

export function CustomerRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["customer"]}>{children}</ProtectedRoute>;
}
