import { z } from "zod";

export const SigninSchema = z.object({
    email: z.string().min(1, "Email is required").pipe(z.email("Invalid email address")),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    keepme: z.boolean().optional(),
});

export type SigninValuesTypes= z.infer< typeof SigninSchema> ;