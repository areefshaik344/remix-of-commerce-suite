/**
 * Mock JWT Token Service
 * Simulates access/refresh token lifecycle for development.
 * Swap this module for real JWT validation when a backend is connected.
 */

import type { User, UserRole } from "@/data/mock-users";

// ── Types ──────────────────────────────────────────────────────────────────

export interface TokenPayload {
  sub: string;       // user id
  email: string;
  role: UserRole;
  name: string;
  iat: number;       // issued at (ms)
  exp: number;       // expires at (ms)
  type: "access" | "refresh";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;     // access token expiry (ms)
  refreshExpiresAt: number;
}

// ── Config ─────────────────────────────────────────────────────────────────

const ACCESS_TOKEN_TTL  = 15 * 60 * 1000;   // 15 minutes
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const STORAGE_KEY_ACCESS  = "mh_access_token";
const STORAGE_KEY_REFRESH = "mh_refresh_token";

// ── Encode / Decode (base64 mock, NOT cryptographically secure) ────────

function encode(payload: TokenPayload): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body   = btoa(JSON.stringify(payload));
  const sig    = btoa(`mock-sig-${payload.sub}-${payload.exp}`);
  return `${header}.${body}.${sig}`;
}

function decode(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1])) as TokenPayload;
  } catch {
    return null;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

export const tokenService = {
  /** Generate a token pair for a user */
  generateTokens(user: User): TokenPair {
    const now = Date.now();
    const accessPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: now,
      exp: now + ACCESS_TOKEN_TTL,
      type: "access",
    };
    const refreshPayload: TokenPayload = {
      ...accessPayload,
      exp: now + REFRESH_TOKEN_TTL,
      type: "refresh",
    };
    return {
      accessToken: encode(accessPayload),
      refreshToken: encode(refreshPayload),
      expiresAt: accessPayload.exp,
      refreshExpiresAt: refreshPayload.exp,
    };
  },

  /** Validate & decode an access token */
  validateAccessToken(token: string): TokenPayload | null {
    const payload = decode(token);
    if (!payload) return null;
    if (payload.type !== "access") return null;
    if (Date.now() > payload.exp) return null; // expired
    return payload;
  },

  /** Validate a refresh token (longer TTL) */
  validateRefreshToken(token: string): TokenPayload | null {
    const payload = decode(token);
    if (!payload) return null;
    if (payload.type !== "refresh") return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  },

  /** Decode without validation (for reading expired tokens) */
  decode,

  /** Check if token will expire within `bufferMs` */
  isExpiringSoon(token: string, bufferMs: number = 60_000): boolean {
    const payload = decode(token);
    if (!payload) return true;
    return Date.now() + bufferMs > payload.exp;
  },

  // ── Secure Storage ──────────────────────────────────────────────────────

  persistTokens(pair: TokenPair) {
    try {
      sessionStorage.setItem(STORAGE_KEY_ACCESS, pair.accessToken);
      // Refresh token in localStorage for persistence across tabs
      localStorage.setItem(STORAGE_KEY_REFRESH, pair.refreshToken);
    } catch {
      // Storage unavailable (private browsing etc.)
    }
  },

  getStoredAccessToken(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ACCESS);
    } catch {
      return null;
    }
  },

  getStoredRefreshToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_REFRESH);
    } catch {
      return null;
    }
  },

  clearTokens() {
    try {
      sessionStorage.removeItem(STORAGE_KEY_ACCESS);
      localStorage.removeItem(STORAGE_KEY_REFRESH);
    } catch {
      // noop
    }
  },

  // ── Constants ───────────────────────────────────────────────────────────
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
};
