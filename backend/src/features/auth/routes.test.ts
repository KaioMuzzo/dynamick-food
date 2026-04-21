import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { seedCompany } from '../../test/seeds/company'
import { ErrorCode } from '../../constants/errorCodes'
import { prisma } from '../../lib/prisma'
import { seedDriver } from '../../test/seeds/driver'

// ─── POST /api/auth/register/company ─────────────────────────────────────────

const validBody = {
    name: 'Empresa Teste',
    cnpj: '12345678000195',
    phone: '11999999999',
    email: 'empresa@teste.com',
    password: 'senha1234',
}

describe('POST /api/auth/register/company', () => {
    describe('comportamento', () => {
        it('dados válidos -> 201 + { id: string }', async () => {
            const res = await request(app).post('/api/auth/register/company').send(validBody)
            expect(res.status).toBe(201)
            expect(typeof res.body.id).toBe('string')
        })

        it('campo name ausente -> 400', async () => {
            const { name: _, ...body } = validBody
            const res = await request(app).post('/api/auth/register/company').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo cnpj ausente → 400', async () => {
            const { cnpj: _, ...body } = validBody
            const res = await request(app).post('/api/auth/register/company').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo phone ausente → 400', async () => {
            const { phone: _, ...body } = validBody
            const res = await request(app).post('/api/auth/register/company').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo email ausente → 400', async () => {
            const { email: _, ...body } = validBody
            const res = await request(app).post('/api/auth/register/company').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo password ausente → 400', async () => {
            const { password: _, ...body } = validBody
            const res = await request(app).post('/api/auth/register/company').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('body vazio → 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({})
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('name vazio -> 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, name: '' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('cnpj com menos de 14 dígitos -> 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, cnpj: '1234' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('cnpj com mais de 14 dígitos -> 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, cnpj: '123456789012345' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('phone com menos de 10 caracteres → 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, phone: '119999' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('email inválido → 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, email: 'nao-é-email' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('password com menos de 8 caracteres → 400', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, password: '123' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('email já cadastrado → 409', async () => {
            await seedCompany()
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, email: 'seed@empresa.com', cnpj: '99999999000199' })
            expect(res.status).toBe(409)
            expect(res.body.error).toBe(ErrorCode.CONFLICT)
        })

        it('cnpj já cadastrado → 409', async () => {
            await seedCompany()
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, email: 'outro@teste.com', cnpj: '12345678000195' })
            expect(res.status).toBe(409)
            expect(res.body.error).toBe(ErrorCode.CONFLICT)
        })
    })

    describe('segurança', () => {
        it('mass assignment -> role ADMIN ignorado, user criado como COMPANY', async () => {
            const res = await request(app).post('/api/auth/register/company').send({ ...validBody, role: 'ADMIN', refreshToken: 'abc' })
            expect(res.status).toBe(201)
            const user = await prisma.user.findUnique({ where: { id: res.body.id } })
            expect(user?.role).toBe('COMPANY')
        })

        it('sensitive data -> resposta não expõe password new refreshToken', async () => {
            const res = await request(app).post('/api/auth/register/company').send(validBody)
            expect(res.status).toBe(201)
            expect(res.body.password).toBeUndefined()
            expect(res.body.refreshToken).toBeUndefined() 
        })

        it('verbose errors -> erro de validação não expõe stack trace', async () => {
            const res = await request(app).post('/api/auth/register/company').send({})
            expect(res.status).toBe(400)
            expect(res.body.stack).toBeUndefined()
            expect(res.body.message).toBeUndefined()
        })
    })
})

// ─── POST /api/auth/register/driver ─────────────────────────────────────────

const validDriverBody = {
    name: 'Driver Teste',
    cpf: '12345678901',
    cnh: '12345678901',
    phone: '11999999999',
    email: 'driver@teste.com',
    password: 'senha1234',
}

describe('POST /api/auth/register/driver', () => {

    describe('comportamento', () => {
        it('dados válidos → 201 + { id: string }', async () => {
            const res = await request(app).post('/api/auth/register/driver').send(validDriverBody)
            expect(res.status).toBe(201)
            expect(typeof res.body.id).toBe('string')
        })

        it('campo name ausente → 400', async () => {
            const { name: _, ...body } = validDriverBody
            const res = await request(app).post('/api/auth/register/driver').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo cpf ausente → 400', async () => {
            const { cpf: _, ...body } = validDriverBody
            const res = await request(app).post('/api/auth/register/driver').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo cnh ausente → 400', async () => {
            const { cnh: _, ...body } = validDriverBody
            const res = await request(app).post('/api/auth/register/driver').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo phone ausente → 400', async () => {
            const { phone: _, ...body } = validDriverBody
            const res = await request(app).post('/api/auth/register/driver').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo email ausente → 400', async () => {
            const { email: _, ...body } = validDriverBody
            const res = await request(app).post('/api/auth/register/driver').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('campo password ausente → 400', async () => {
            const { password: _, ...body } = validDriverBody
            const res = await request(app).post('/api/auth/register/driver').send(body)
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('body vazio → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({})
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('name vazio → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, name: '' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('cpf com menos de 11 dígitos → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, cpf: '1234' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('cpf com mais de 11 dígitos → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, cpf: '123456789012' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('cnh com menos de 11 caracteres → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, cnh: '123' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('phone com menos de 10 caracteres → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, phone: '119999' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('email inválido → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, email: 'nao-é-email' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('password com menos de 8 caracteres → 400', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, password: '123' })
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(ErrorCode.VALIDATION_ERROR)
        })

        it('email já cadastrado → 409', async () => {
            await seedDriver()
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, email: 'seed@driver.com', cpf: '99999999901' })
            expect(res.status).toBe(409)
            expect(res.body.error).toBe(ErrorCode.CONFLICT)
        })

        it('cpf já cadastrado → 409', async () => {
            await seedDriver()
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, email: 'outro@driver.com', cpf: '12345678901' })
            expect(res.status).toBe(409)
            expect(res.body.error).toBe(ErrorCode.CONFLICT)
        })
    })

    describe('segurança', () => {
        it('mass assignment → status ATIVO ignorado, driver criado como PENDENTE', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({ ...validDriverBody, role: 'ADMIN', status: 'ATIVO' })
            expect(res.status).toBe(201)
            const user = await prisma.user.findUnique({ where: { id: res.body.id }, include: { driver: true } })
            expect(user?.role).toBe('DRIVER')
            expect(user?.driver?.status).toBe('PENDENTE')
        })

        it('sensitive data → resposta não expõe password, cpf nem refreshToken', async () => {
            const res = await request(app).post('/api/auth/register/driver').send(validDriverBody)
            expect(res.status).toBe(201)
            expect(res.body.password).toBeUndefined()
            expect(res.body.cpf).toBeUndefined()
            expect(res.body.refreshToken).toBeUndefined()
        })

        it('verbose errors → erro de validação não expõe stack trace', async () => {
            const res = await request(app).post('/api/auth/register/driver').send({})
            expect(res.status).toBe(400)
            expect(res.body.stack).toBeUndefined()
            expect(res.body.message).toBeUndefined()
        })
    })

})