// Types re-exported for backward compatibility
export type { UserRole, User, Address, Vendor } from "@/data/mock-users";

// Re-export mock data from new location
import { mockUsers, mockVendors } from "@/mocks/mockUsers";
export const users = mockUsers;
export const vendors = mockVendors;

// Keep original type definitions for imports
export type { UserRole, User, Address, Vendor };
