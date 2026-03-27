import { useState, useEffect, useCallback, useRef } from "react";

const COOLDOWN_SECONDS = 30;

export function useOtpCooldown() {
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [cooldown > 0]);

  const startCooldown = useCallback(() => setCooldown(COOLDOWN_SECONDS), []);
  const resetCooldown = useCallback(() => { setCooldown(0); clearInterval(timerRef.current); }, []);

  return { cooldown, isCoolingDown: cooldown > 0, startCooldown, resetCooldown };
}
