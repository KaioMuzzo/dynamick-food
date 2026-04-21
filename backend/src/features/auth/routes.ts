import { Router } from 'express'
import { registerCompanyController } from './controller'

export const authRoutes = Router()

authRoutes.post('/register/company', registerCompanyController)
