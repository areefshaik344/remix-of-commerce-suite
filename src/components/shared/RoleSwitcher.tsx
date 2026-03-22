import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/data/mock-users";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Shield } from "lucide-react";

const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string }[] = [
  { role: "customer", label: "Customer", icon: <ShoppingBag className="h-4 w-4" />, path: "/" },
  { role: "vendor", label: "Vendor", icon: <Store className="h-4 w-4" />, path: "/vendor" },
  { role: "admin", label: "Admin", icon: <Shield className="h-4 w-4" />, path: "/admin" },
];

export function RoleSwitcher() {
  const { role: currentRole, login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
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
