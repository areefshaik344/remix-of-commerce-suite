import { useAuthStore } from "@/features/auth";
import type { UserRole } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Shield } from "lucide-react";
import { authApi } from "@/api/authApi";

const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string; email: string }[] = [
  { role: "customer", label: "Customer", icon: <ShoppingBag className="h-4 w-4" />, path: "/", email: "customer@demo.com" },
  { role: "vendor", label: "Vendor", icon: <Store className="h-4 w-4" />, path: "/vendor", email: "vendor@demo.com" },
  { role: "admin", label: "Admin", icon: <Shield className="h-4 w-4" />, path: "/admin", email: "admin@demo.com" },
];

/**
 * DEV-ONLY: Role switcher for testing different user roles.
 * This component is hidden in production builds.
 */
export function RoleSwitcher() {
  if (import.meta.env.PROD) return null;

  const currentRole = useAuthStore((s) => s.currentRole);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSwitch = async (role: typeof roles[number]) => {
    try {
      const res = await authApi.login({ email: role.email, password: "demo123" });
      setAuth(res.accessToken, res.user as any);
      navigate(role.path);
    } catch {
      // Fallback: just set role locally for dev
      setAuth("dev-token", { id: "dev", name: role.label, email: role.email, role: role.role, avatar: "", phone: "", joinedDate: "" } as any);
      navigate(role.path);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <span className="text-[9px] text-muted-foreground px-1 font-mono">DEV</span>
      {roles.map((r) => (
        <Button
          key={r.role}
          size="sm"
          variant={currentRole === r.role ? "default" : "ghost"}
          className={`gap-1.5 text-xs ${currentRole === r.role ? "shadow-sm" : ""}`}
          onClick={() => handleSwitch(r)}
        >
          {r.icon}
          <span className="hidden sm:inline">{r.label}</span>
        </Button>
      ))}
    </div>
  );
}
