import { z } from "zod";

const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

const bdPhoneSchema = z
    .string()
    .min(1, "Phone number is required")
    .regex(BD_PHONE_REGEX, "Enter a valid 11-digit phone number starting with 01 (e.g. 01818652760)");

export const loginZodSchema = z.object({
    identifier: z
        .string()
        .min(1, "Email or phone number is required")
        .refine(
            (v) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || BD_PHONE_REGEX.test(v),
            "Enter a valid email address or 11-digit BD phone number"
        ),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    phone: bdPhoneSchema,
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
    referralCode: z.string().optional(),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const forgotPasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
    phone: bdPhoneSchema,
});

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;

export const resetPasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters long"),
});

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;

export const verifyEmailZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;

export const changePasswordZodSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "New password must be at least 8 characters long"),
});

export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;

export const recruiterRegisterZodSchema = z.object({
    // Personal Information
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: z.string()
        .email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
    designation: z.string()
        .min(2, "Designation must be at least 2 characters")
        .max(50, "Designation must not exceed 50 characters")
        .optional()
        .or(z.literal("")),
    profilePhoto: z.string().optional().or(z.literal("")),

    // Company Information
    companyName: z.string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must not exceed 100 characters"),
    industry: z.string()
        .min(1, "Industry is required"),
    companyWebsite: z.string()
        .url("Invalid URL").optional()
        .or(z.literal("")),
    companyAddress: z.string()
        .min(5, "Company address must be at least 5 characters")
        .max(200, "Company address must not exceed 200 characters")
        .optional()
        .or(z.literal("")),
    companySize: z.string()
        .optional()
        .or(z.literal("")),
    description: z.string()
        .max(500, "Description must not exceed 500 characters")
        .optional()
        .or(z.literal("")),
    companyLogo: z.string().optional().or(z.literal("")),

    // Contact Information
    contactNumber: z.string()
        .regex(BD_PHONE_REGEX, "Enter a valid 11-digit BD phone number")
        .optional()
        .or(z.literal("")),
});

export type IRecruiterRegisterPayload = z.infer<typeof recruiterRegisterZodSchema>;
