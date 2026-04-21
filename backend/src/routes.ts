import { Router } from 'express'
import { infraRoutes } from './features/infra/routes' 
import { authRoutes } from './features/auth/routes'

export const router = Router()

router.use('/infra', infraRoutes)
router.use('/auth', authRoutes)
