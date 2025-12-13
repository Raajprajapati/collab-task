import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { PrismaClient } from '../../generated/prisma/client.js';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = verifyToken(token) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }

        req.user = { id: user.id };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
