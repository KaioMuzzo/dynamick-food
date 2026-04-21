import { z } from 'zod'

export const registerCompanySchema = z.object({
    name: z.string().min(1),
    cnpj: z.string().length(14),
    phone: z.string().min(10),
    email: z.email(),
    password: z.string().min(8),
})

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>