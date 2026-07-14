import { z } from 'zod'

export const SignupSchema = z.object({

    name: z
        .string()
        .nonempty('Full name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(24, 'Name must not exceed 24 characters'),

    email: z
        .string()
        .nonempty('Email is required')
        .email('Invalid email address'),

    password: z
        .string()
        .nonempty('Password is required')
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[!@#$%^&*()\[\]{}\-_+=~`|:;"'<>,./?]/,
            "Password must contain at least one special character"
        ),

    rePassword: z
        .string()
        .nonempty('Please confirm your password'),

    profileImage: z
        .any()
        .refine((file) => file?.length > 0, {
            message: "Profile image is required",
        }),

    terms: z
        .boolean()
        .refine((val) => val === true, {
            message: "You must accept the terms and conditions",
        }),

}).refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"]
})

export type SignupSchemaType = z.infer<typeof SignupSchema>