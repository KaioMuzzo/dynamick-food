import { describe, it, expect } from 'vitest'
import { registerCompany, registerDriver } from './service'
import { seedCompany } from '../../test/seeds/company'
import { seedDriver } from '../../test/seeds/driver'

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

describe('registerDriver', () => {
    it('dados válidos -> retorna id do user criado', async () => {
        const result = await registerDriver({
            name: 'Driver Teste',
            cpf: '12345678901',
            cnh: '12345678901',
            phone: '11999999999',
            email: 'driver@teste.com',
            password: 'senha1234',
        })

        expect(result.id).toBeDefined()
    })

    it('email já existente -> lança P2002', async () => {
        await seedDriver()

        await expect(
            registerDriver({
                name: 'Outro Driver',
                cpf: '99999999901',
                cnh: '99999999901',
                phone: '11988888888',
                email: 'seed@driver.com',
                password: 'senha1234',
            })
        ).rejects.toMatchObject({ code: 'P2002' })
    })

    it('cpf já existente -> lança P2002', async () => {
        await seedDriver()

        await expect(
            registerDriver({
                name: 'Outro Driver',
                cpf: '12345678901',
                cnh: '99999999901',
                phone: '11988888888',
                email: 'outro@driver.com',
                password: 'senha1234',
            })
        ).rejects.toMatchObject({ code: 'P2002' })
    })
})