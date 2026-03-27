/**
 * Production Axios HTTP Client
 *
 * - Reads accessToken from Zustand store (memory-only)
 * - Sends httpOnly refresh cookie automatically (withCredentials)
 * - On 401 → POST /auth/refresh → retry queued requests
 * - If refresh fails → dispatch session-expired event
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/config/constants";
import { ENDPOINTS } from "@/api/endpoints";
import { mapApiError, type MappedApiError } from "@/api/errorMapper";
import type { ApiErrorResponse } from "@/types/api";

// ── Refresh queue ──────────────────────────────────────────────────────────
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

// ── Lazy import to avoid circular dependency ───────────────────────────────
let _getStore: (() => typeof import("@/store/authStore"))["prototype"] | null = null;
async function getAuthStore() {
  if (!_getStore) {
    const mod = await import("@/store/authStore");
    _getStore = mod;
  }
  return _getStore.useAuthStore.getState();
}

function getAuthStoreSync() {
  // After first load, module is cached — safe to use require-style
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = _getStore;
    return mod?.useAuthStore.getState() ?? null;
  } catch {
    return null;
  }
}

// ── Create Axios instance ──────────────────────────────────────────────────
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // CRITICAL: sends httpOnly refresh cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor: attach access token ───────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = getAuthStoreSync();
    const token = store?.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: 401 refresh + retry ──────────────────────────────
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Map error for consumers
    const mapped: MappedApiError = mapApiError(error);
    (error as AxiosError & { mapped?: MappedApiError }).mapped = mapped;

    // ── 401 refresh logic ─────────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh endpoint itself
      if (originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH)) {
        return Promise.reject(error);
      }

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
        // Cookie is sent automatically — no body needed
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken: string = response.data.data?.accessToken || response.data.accessToken;
        if (!newAccessToken) throw new Error("No access token in refresh response");

        // Update store
        const store = await getAuthStore();
        store.setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Session is dead
        const store = await getAuthStore();
        store.clearAuth();
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Helper ─────────────────────────────────────────────────────────────────
export function getMappedError(error: unknown): MappedApiError | null {
  if (axios.isAxiosError(error)) {
    return (error as AxiosError & { mapped?: MappedApiError }).mapped || mapApiError(error as AxiosError<ApiErrorResponse>);
  }
  return null;
}

export { httpClient };
export default httpClient;
