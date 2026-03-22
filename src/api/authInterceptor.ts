/**
 * API Auth Interceptor
 * Attaches access tokens to requests, handles 401 with automatic refresh.
 * Works with the mock apiClient; ready to swap to Axios/fetch when backend is added.
 */

import { tokenService } from "@/lib/tokenService";
import { mockUsers } from "@/mocks/mockUsers";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Get the current access token, refreshing if expired.
 * Returns null if no valid session exists.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = tokenService.getStoredAccessToken();

  // If access token is still valid, return it
  if (accessToken && !tokenService.isExpiringSoon(accessToken)) {
    return accessToken;
  }

  // Try to refresh
  const refreshToken = tokenService.getStoredRefreshToken();
  if (!refreshToken) return null;

  const refreshPayload = tokenService.validateRefreshToken(refreshToken);
  if (!refreshPayload) {
    tokenService.clearTokens();
    return null;
  }

  // Prevent concurrent refresh calls
  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  isRefreshing = true;

  try {
    // Simulate refresh delay
    await new Promise(r => setTimeout(r, 200));

    // Find user from refresh token payload
    const user = mockUsers.find(u => u.id === refreshPayload.sub);
    if (!user) {
      tokenService.clearTokens();
      return null;
    }

    // Generate new token pair
    const newPair = tokenService.generateTokens(user);
    tokenService.persistTokens(newPair);
    
    onRefreshed(newPair.accessToken);
    return newPair.accessToken;
  } finally {
    isRefreshing = false;
  }
}

/**
 * Build request headers with auth token.
 */
export function buildAuthHeaders(existingHeaders: Record<string, string> = {}): Record<string, string> {
  const token = tokenService.getStoredAccessToken();
  if (token) {
    return { ...existingHeaders, Authorization: `Bearer ${token}` };
  }
  return existingHeaders;
}

/**
 * Handle a 401 response: try to refresh and retry.
 * Returns true if refresh succeeded (caller should retry), false if session is dead.
 */
export async function handle401(): Promise<boolean> {
  const newToken = await getValidAccessToken();
  return newToken !== null;
}
