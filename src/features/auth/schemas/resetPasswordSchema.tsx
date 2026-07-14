import { z } from "zod";

export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .nonempty('Password is required')
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*()\[\]{}\-_+=~`|:;"'<>,./?]/, "Password must contain at least one special character"),
    confirmPassword: z.string().nonempty('Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
