import { prisma } from '../../lib/prisma'

export async function seedCompany() {
    return prisma.user.create({
        data: {
            email: 'seed@empresa.com',
            password: 'fakepassword',
            role: 'COMPANY',
            company: {
                create: {
                    name: 'Empresa Seed',
                    cnpj: '12345678000195',
                    phone: '11999999999',
                },
            },
        },
    })
}
