/**
 * Zod validation schemas for ALL forms across the application.
 * Aligned with Spring Boot API contract DTOs.
 */
import { z } from "zod";

// ── Shared primitives ────────────────────────────────────────────────────
const phone10 = z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number");
const pincode6 = z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode");
const strongPassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Must contain at least one letter")
  .regex(/\d/, "Must contain at least one number");

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
    phone: phone10,
    password: strongPassword,
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
  phone: phone10,
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ── Profile ──────────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: phone10,
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// ── Address ──────────────────────────────────────────────────────────────
export const addressSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: phone10,
  line1: z.string().trim().min(5, "Address line 1 is required").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  pincode: pincode6,
  label: z.enum(["home", "work", "other"]),
  isDefault: z.boolean().optional(),
});
export type AddressFormData = z.infer<typeof addressSchema>;

// ── Checkout ─────────────────────────────────────────────────────────────
export const checkoutAddressSchema = z.object({
  selectedAddress: z.string().min(1, "Please select a delivery address"),
});

export const checkoutPaymentSchema = z.object({
  paymentMethod: z.enum(["upi", "card", "netbanking", "cod"], {
    required_error: "Please select a payment method",
  }),
  upiId: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "upi" && (!data.upiId || !data.upiId.includes("@"))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid UPI ID (e.g. name@upi)", path: ["upiId"] });
  }
  if (data.paymentMethod === "card") {
    if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length !== 16) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid 16-digit card number", path: ["cardNumber"] });
    }
    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter expiry as MM/YY", path: ["cardExpiry"] });
    }
    if (!data.cardCvv || !/^\d{3,4}$/.test(data.cardCvv)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid CVV", path: ["cardCvv"] });
    }
  }
});
export type CheckoutPaymentFormData = z.infer<typeof checkoutPaymentSchema>;

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Enter a coupon code")
    .max(20)
    .transform((v) => v.toUpperCase()),
});
export type CouponFormData = z.infer<typeof couponSchema>;

// ── Vendor Registration ──────────────────────────────────────────────────
export const vendorRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: phone10,
  password: strongPassword,
  storeName: z.string().trim().min(3, "Store name must be at least 3 characters").max(100),
  category: z.string().min(1, "Please select a category"),
  description: z.string().trim().max(500).optional(),
  agreed: z.literal(true, {
    errorMap: () => ({ message: "You must accept the vendor agreement" }),
  }),
});
export type VendorRegistrationFormData = z.infer<typeof vendorRegistrationSchema>;

// ── Vendor Product Form ──────────────────────────────────────────────────
export const vendorProductSchema = z.object({
  name: z.string().trim().min(3, "Product name must be at least 3 characters").max(200),
  description: z.string().trim().max(5000).optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().trim().max(100).optional(),
  price: z.number({ invalid_type_error: "Price is required" }).positive("Price must be greater than 0"),
  originalPrice: z.number().positive("Must be greater than 0").optional(),
  stock: z.number({ invalid_type_error: "Stock is required" }).int().min(0, "Stock cannot be negative"),
  sku: z.string().trim().max(50).optional(),
  tags: z.array(z.string()).max(20).optional(),
  images: z.array(z.string().url()).min(1, "At least 1 image is required").max(6),
  featured: z.boolean().optional(),
});
export type VendorProductFormData = z.infer<typeof vendorProductSchema>;

// ── Review ───────────────────────────────────────────────────────────────
export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Rating is required").max(5),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  comment: z.string().trim().min(10, "Review must be at least 10 characters").max(2000),
});
export type ReviewFormData = z.infer<typeof reviewSchema>;

// ── Contact Form ─────────────────────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;
