import rateLimit from 'express-rate-limit'
import { ErrorCode } from '../constants/errorCodes'

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: ErrorCode.TOO_MANY_REQUESTS },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: ErrorCode.TOO_MANY_REQUESTS },
    standardHeaders: true,
    legacyHeaders: false,
});

export {
    globalLimiter,
    loginLimiter
}