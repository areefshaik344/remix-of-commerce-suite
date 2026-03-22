/**
 * Hook to listen for session expiry events dispatched by httpClient interceptor.
 * Automatically logs out the user and redirects to login.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import { tokenService } from "@/lib/tokenService";

export function useSessionExpiry() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clearCart);
  const { toast } = useToast();

  useEffect(() => {
    const handler = () => {
      tokenService.clearTokens();
      logout();
      clearCart();
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, [logout, clearCart, navigate, toast]);
}
