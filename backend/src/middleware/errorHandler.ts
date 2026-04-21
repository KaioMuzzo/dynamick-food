import { Request, Response, NextFunction } from 'express'
import { ErrorCode, ErrorCodeKey, getStatusCode } from '../constants/errorCodes'
import { Prisma } from '../generated/prisma/client'
import { ZodError } from 'zod'
import { env } from '../env'

export class AppError extends Error {
    public statusCode: number

    constructor(public code: ErrorCodeKey) {
        super(code)
        this.name = 'AppError'
        this.statusCode = getStatusCode(code)
    }
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.code })
        return
    }

    if (err instanceof ZodError) {
        const details = env.NODE_ENV !== 'production' ? err.issues : undefined
        res.status(400).json({ error: ErrorCode.VALIDATION_ERROR, ...(details && { details }) })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: ErrorCode.CONFLICT })
            return
        }
    }

    console.error(err)
    res.status(500).json({ error: 'INTERNAL_ERROR' })
}