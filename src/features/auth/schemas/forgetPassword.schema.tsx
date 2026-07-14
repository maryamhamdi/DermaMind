import zod from "zod"
export const forgetPasswordSchema = zod.object({
    email: zod.string('').nonempty('Email is required').pipe(zod.email({ message: 'Invalid email address' }))
})


export type ForgetPasswordFormData = zod.infer<typeof forgetPasswordSchema>