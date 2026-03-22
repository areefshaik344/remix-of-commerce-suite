/**
 * Online/Offline detection hook with toast notifications.
 */
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      toast({ title: "Back online", description: "Your connection has been restored." });
    };
    const goOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Some features may not work until you reconnect.",
        variant: "destructive",
      });
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [toast]);

  return isOnline;
}
