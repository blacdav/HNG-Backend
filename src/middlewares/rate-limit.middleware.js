import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

export const AuthLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: true,
    // ipv6Subnet: 60,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    message: {
        status: "error",
        message: "Too many requests, please try again later"
    }
});

export const ApiLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: true,
    // ipv6Subnet: 60,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    message: {
        status: "error",
        message: "Too many requests, please try again later"
    }
});