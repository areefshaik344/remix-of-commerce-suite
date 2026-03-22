/**
 * Zod validation schemas for forms across the application.
 */
import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128)
      .regex(/[A-Za-z]/, "Must contain at least one letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string(),
    agreed: z.literal(true, {
      errorMap: () => ({ message: "You must accept Terms & Conditions" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type SignupFormData = z.infer<typeof signupSchema>;

export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// ── Checkout ──────────────────────────────────────────────────────────────

export const checkoutAddressSchema = z.object({
  selectedAddress: z.string().min(1, "Please select a delivery address"),
});

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Enter a coupon code")
    .max(20)
    .transform((v) => v.toUpperCase()),
});
export type CouponFormData = z.infer<typeof couponSchema>;

// ── Address ───────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  line1: z.string().trim().min(5, "Address line 1 is required").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  label: z.enum(["home", "work", "other"]),
  isDefault: z.boolean().optional(),
});
export type AddressFormData = z.infer<typeof addressSchema>;
