import { RequestHandler } from 'express'
import { asyncHandler } from '../../middleware/asyncHandler'
import { registerCompanySchema } from 'shared/schemas/auth'
import { registerCompany } from './service'

export const registerCompanyController: RequestHandler = asyncHandler(async (req, res) => {
    const body = registerCompanySchema.parse(req.body)
    const result = await registerCompany(body)
    res.status(201).json(result)
})