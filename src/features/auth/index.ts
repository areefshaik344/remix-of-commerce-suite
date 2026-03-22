/**
 * Auth Feature — Barrel Export
 *
 * Usage:
 *   import { useAuth, useAuthStore, ProtectedRoute } from "@/features/auth";
 *   import type { User, UserRole } from "@/features/auth";
 */
export * from "./types";
export * from "./api";
export * from "./store";
export * from "./hooks";
export * from "./components";

// Re-export data for convenience
export { users, vendors } from "@/data/mock-users";
