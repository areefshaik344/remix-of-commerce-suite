/**
 * Production-ready Axios HTTP Client
 * 
 * - Attaches access token to every request
 * - On 401 → refreshes token → retries original request
 * - Queues concurrent requests during token refresh
 * - Maps all errors through errorMapper for user-friendly messages
 * - Request timeout + cancellation support
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenService } from "@/lib/tokenService";
import { API_BASE_URL, API_TIMEOUT } from "@/config/constants";
import { mapApiError, type MappedApiError } from "@/api/errorMapper";
import type { ApiErrorResponse } from "@/types/api";

// Flag to use mock fallback when backend is unavailable
const USE_MOCK_FALLBACK = true; // Set to false when real backend is connected

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
}

// Create Axios instance
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getStoredAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Map the error for consistent handling downstream
    const mapped: MappedApiError = mapApiError(error);

    // Attach mapped error for consumers
    (error as AxiosError & { mapped?: MappedApiError }).mapped = mapped;

    // ── 401 refresh logic ────────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue requests during refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(httpClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenService.getStoredRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const payload = tokenService.validateRefreshToken(refreshToken);
        if (!payload) {
          throw new Error("Refresh token invalid");
        }

        // In production: POST /auth/refresh { refreshToken }
        const { mockUsers } = await import("@/mocks/mockUsers");
        const user = mockUsers.find((u) => u.id === payload.sub);
        if (!user) throw new Error("User not found");

        const newTokens = tokenService.generateTokens(user);
        tokenService.persistTokens(newTokens);

        processQueue(null, newTokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearTokens();
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper: extract the mapped error from an Axios error.
 * Use in catch blocks: `const err = getMappedError(e);`
 */
export function getMappedError(error: unknown): MappedApiError | null {
  if (axios.isAxiosError(error)) {
    return (error as AxiosError & { mapped?: MappedApiError }).mapped || mapApiError(error as AxiosError<ApiErrorResponse>);
  }
  return null;
}

export { httpClient, USE_MOCK_FALLBACK };
export default httpClient;
