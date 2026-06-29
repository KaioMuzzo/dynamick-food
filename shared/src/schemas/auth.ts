import { z } from 'zod'

const registerCompanySchema = z.object({
    name: z.string().min(1),
    cnpj: z.string().length(14),
    phone: z.string().min(10),
    email: z.email(),
    password: z.string().min(8),
});

type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;

const registerDriverSchema = z.object({
    name: z.string().min(1),
    cpf: z.string().length(11),
    cnh: z.string().min(11),
    phone: z.string().min(10),
    email: z.email(),
    password: z.string().min(8),
});

type RegisterDriverInput = z.infer<typeof registerDriverSchema>;

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;

const resetPasswordSchema = z.object({
    code: z.string().min(1),
    password: z.string().min(8),
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export {
    registerCompanySchema,
    registerDriverSchema,
    loginSchema,
    resetPasswordSchema
}

export type {
    RegisterCompanyInput,
    RegisterDriverInput,
    LoginInput,
    ResetPasswordInput
}