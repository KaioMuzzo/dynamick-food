import { prisma } from '../../lib/prisma'

export async function seedDriver() {
    return prisma.user.create({
        data: {
            email: 'seed@driver.com',
            password: 'hash',
            role: 'DRIVER',
            driver: {
                create: {
                    name: 'Driver Seed',
                    cpf: '12345678901',
                    cnh: '12345678901',
                    phone: '11999999999',
                },
            },
        },
        include: { driver: true },
    })
}