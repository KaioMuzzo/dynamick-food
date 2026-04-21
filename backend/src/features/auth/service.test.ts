import { describe, it, expect } from 'vitest'
import { prisma } from '../../lib/prisma'
import { registerCompany } from './service'
import { seedCompany } from '../../test/seeds/company'

describe('registerCompany', () => {
    it('dados válidos -> retorna id do user criado', async() => {
        const result = await registerCompany({
            name: 'Empresa Teste',
            cnpj: '12345678000195',
            phone: '11999999999',
            email: 'empresa@teste.com',
            password: 'senha1234',
        })

        expect(result.id).toBeDefined()
    })

    it('email já existente -> lança P2002', async () => {
        await seedCompany()

        await expect(
            registerCompany({
                name: 'Outra Empresa',
                cnpj: '99999999000199',
                phone: '11988888888',
                email: 'seed@empresa.com',
                password: 'senha1234',
            })
        ).rejects.toMatchObject({ code: 'P2002' })
    })

    it('cnpj já existente -> lança P2002', async () => {
        await seedCompany()

        await expect(
            registerCompany({
                name: 'Outra Empresa',
                cnpj: '12345678000195',
                phone: '11988888888',
                email: 'outro@empresa.com',
                password: 'senha1234',
            })
        ).rejects.toMatchObject({ code: 'P2002' })
    })
})