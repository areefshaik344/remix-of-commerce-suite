import { mockSuccess, simulateDelay, ApiError, type ApiResponse } from "./apiClient";
import { mockUsers, mockCredentials } from "@/mocks";
import type { User } from "@/data/mock-users";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  async login(req: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    await simulateDelay(500);

    // Phone OTP mock
    if (req.password === "phone-otp") {
      const user = mockUsers.find(u => u.role === "customer") || mockUsers[0];
      return mockSuccess({ user, token: `mock-token-${user.id}` }, "Login successful");
    }

    const cred = mockCredentials.find(c => c.email === req.email && c.password === req.password);
    if (!cred) throw new ApiError("Invalid email or password", 401);

    const user = mockUsers.find(u => u.id === cred.userId);
    if (!user) throw new ApiError("User not found", 404);

    return mockSuccess({ user, token: `mock-token-${user.id}` }, "Login successful");
  },

  async signup(req: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    await simulateDelay(600);

    if (mockCredentials.find(c => c.email === req.email)) {
      throw new ApiError("Email already registered", 409);
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: req.name,
      email: req.email,
      avatar: "",
      role: "customer",
      phone: `+91 ${req.phone}`,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    mockCredentials.push({ email: req.email, password: req.password, userId: newUser.id });
    mockUsers.push(newUser);

    return mockSuccess({ user: newUser, token: `mock-token-${newUser.id}` }, "Account created");
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    await simulateDelay(500);
    const exists = mockCredentials.find(c => c.email === email);
    // Always return success to prevent email enumeration
    return mockSuccess({ message: "If this email exists, a reset link has been sent." });
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    await simulateDelay(500);
    return mockSuccess({ message: "Password reset successful" });
  },

  async verifyEmail(code: string): Promise<ApiResponse<{ verified: boolean }>> {
    await simulateDelay(400);
    // Accept any 6-digit code
    return mockSuccess({ verified: code.length === 6 });
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await simulateDelay(100);
    // In a real app, this would validate the session token
    return mockSuccess(null);
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    await simulateDelay(400);
    const userIdx = mockUsers.findIndex(u => u.id === userId);
    if (userIdx === -1) throw new ApiError("User not found", 404);
    mockUsers[userIdx] = { ...mockUsers[userIdx], ...data };
    return mockSuccess(mockUsers[userIdx], "Profile updated");
  },
};
