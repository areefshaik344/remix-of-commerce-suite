/**
 * Auth API — Real backend calls
 * All token storage is handled by httpOnly cookies (refresh) and Zustand (access).
 */

import httpClient from "@/api/httpClient";
import { ENDPOINTS } from "@/api/endpoints";

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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "vendor" | "admin";
  joinedDate?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  /** POST /auth/login — returns accessToken + user, sets refresh cookie */
  async login(req: LoginRequest): Promise<AuthResponse> {
    const res = await httpClient.post(ENDPOINTS.AUTH.LOGIN, req);
    const data = res.data?.data || res.data;
    return {
      accessToken: data.accessToken || data.token,
      user: data.user,
    };
  },

  /** POST /auth/register — returns accessToken + user, sets refresh cookie */
  async signup(req: SignupRequest): Promise<AuthResponse> {
    const res = await httpClient.post(ENDPOINTS.AUTH.REGISTER, req);
    const data = res.data?.data || res.data;
    return {
      accessToken: data.accessToken || data.token,
      user: data.user,
    };
  },

  /** POST /auth/refresh — cookie sent automatically, returns new accessToken */
  async refresh(): Promise<AuthResponse> {
    const res = await httpClient.post(ENDPOINTS.AUTH.REFRESH);
    const data = res.data?.data || res.data;
    return {
      accessToken: data.accessToken || data.token,
      user: data.user,
    };
  },

  /** POST /auth/logout — clears refresh cookie on server */
  async logout(): Promise<void> {
    try {
      await httpClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Always clear locally even if server call fails
    }
  },

  /** POST /auth/forgot-password */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await httpClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return res.data?.data || res.data;
  },

  /** POST /auth/reset-password */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const res = await httpClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password: newPassword });
    return res.data?.data || res.data;
  },

  /** POST /auth/verify-email */
  async verifyEmail(code: string): Promise<{ verified: boolean }> {
    const res = await httpClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { code });
    return res.data?.data || res.data;
  },

  /** POST /auth/resend-verification — resend email OTP with cooldown */
  async resendVerification(email: string): Promise<{ message: string }> {
    const res = await httpClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
    return res.data?.data || res.data;
  },

  /** GET /auth/me — get current user from token */
  async getCurrentUser(): Promise<AuthUser> {
    const res = await httpClient.get(ENDPOINTS.AUTH.ME);
    return res.data?.data || res.data;
  },

  /** POST /auth/send-otp — sends OTP to phone number */
  async sendOtp(phone: string): Promise<{ message: string; otp?: string }> {
    const res = await httpClient.post(ENDPOINTS.AUTH.SEND_OTP, { phone });
    return res.data?.data || res.data;
  },

  /** POST /auth/verify-otp — verifies OTP and returns auth tokens */
  async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
    const res = await httpClient.post(ENDPOINTS.AUTH.VERIFY_OTP, { phone, otp });
    const data = res.data?.data || res.data;
    return {
      accessToken: data.accessToken || data.token,
      user: data.user,
    };
  },
};
