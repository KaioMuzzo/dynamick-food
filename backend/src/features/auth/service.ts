import { prisma } from '../../lib/prisma'
import { RegisterCompanyInput } from 'shared/schemas/auth'
import bcrypt from 'bcryptjs'

export async function registerCompany(data: RegisterCompanyInput) {
    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            role: 'COMPANY',
            company: {
                create: {
                    name: data.name,
                    cnpj: data.cnpj,
                    phone: data.phone,
                },
            },
        },
        select: {
            id: true,
        }
    })

    return user
}