import { RequestHandler } from 'express'
import { asyncHandler } from '../../middleware/asyncHandler'
import { registerCompanySchema, registerDriverSchema } from 'shared/schemas/auth'
import { registerCompany, registerDriver } from './service'

export const registerCompanyController: RequestHandler = asyncHandler(async (req, res) => {
    const body = registerCompanySchema.parse(req.body)
    const result = await registerCompany(body)
    res.status(201).json(result)
})

export const registerDriverController: RequestHandler = asyncHandler(async (req, res) => {
    const body = registerDriverSchema.parse(req.body)
    const result = await registerDriver(body)
    res.status(201).json(result)
})
