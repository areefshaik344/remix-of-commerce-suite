import { useAuth } from "@/features/auth";
import type { UserRole } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Shield } from "lucide-react";

const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string }[] = [
  { role: "customer", label: "Customer", icon: <ShoppingBag className="h-4 w-4" />, path: "/" },
  { role: "vendor", label: "Vendor", icon: <Store className="h-4 w-4" />, path: "/vendor" },
  { role: "admin", label: "Admin", icon: <Shield className="h-4 w-4" />, path: "/admin" },
];

/**
 * DEV-ONLY: Role switcher for testing different user roles.
 * This component is hidden in production builds.
 */
export function RoleSwitcher() {
  // Hide in production
  if (import.meta.env.PROD) return null;

  const { role: currentRole, login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <span className="text-[9px] text-muted-foreground px-1 font-mono">DEV</span>
      {roles.map(({ role, label, icon, path }) => (
        <Button
          key={role}
          size="sm"
          variant={currentRole === role ? "default" : "ghost"}
          className={`gap-1.5 text-xs ${currentRole === role ? "shadow-sm" : ""}`}
          onClick={() => { login(role); navigate(path); }}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
