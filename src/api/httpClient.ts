/**
 * Production-ready Axios HTTP Client
 * 
 * - Attaches access token to every request
 * - On 401 → refreshes token → retries original request
 * - Queues concurrent requests during token refresh
 * - Falls back to mock API layer when no backend is available
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenService } from "@/lib/tokenService";
import { API_BASE_URL, API_TIMEOUT } from "@/config/constants";

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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If not 401 or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

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
      // For now: simulate token refresh using mock users
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
      // Dispatch a custom event so auth store can react
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { httpClient, USE_MOCK_FALLBACK };
export default httpClient;
