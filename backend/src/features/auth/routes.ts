import { Router } from 'express'
import { registerCompanyController, registerDriverController } from './controller'

export const authRoutes = Router()

authRoutes.post('/register/company', registerCompanyController)
authRoutes.post('/register/driver', registerDriverController)