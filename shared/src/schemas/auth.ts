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

const vehicleTypeSchema = z.enum(['motorcycle', 'car', 'van', 'bicycle']);

type VehicleTypeInput = z.infer<typeof vehicleTypeSchema>;

const vehicleSchema = z.object({
    type: vehicleTypeSchema,
    plate: z.string().min(1),
    model: z.string().min(1),
    color: z.string().min(1),
});

type VehicleInput = z.infer<typeof vehicleSchema>;

// Full driver registration wizard: personal data plus the driver's vehicle.
// Documents are uploaded through a separate endpoint and are not part of this schema.
const registerDriverWizardSchema = registerDriverSchema.extend({
    vehicle: vehicleSchema,
});

type RegisterDriverWizardInput = z.infer<typeof registerDriverWizardSchema>;

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
    vehicleTypeSchema,
    vehicleSchema,
    registerDriverWizardSchema,
    loginSchema,
    resetPasswordSchema
}

export type {
    RegisterCompanyInput,
    RegisterDriverInput,
    VehicleTypeInput,
    VehicleInput,
    RegisterDriverWizardInput,
    LoginInput,
    ResetPasswordInput
}