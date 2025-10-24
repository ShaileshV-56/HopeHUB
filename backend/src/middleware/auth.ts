import { Request, Response, NextFunction } from 'express';
import { verify, type JwtPayload, type Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const payload = verify(token, env.jwtSecret as Secret) as JwtPayload | string;
    if (!payload || typeof payload === 'string') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user: AuthenticatedUser = { id: String(payload.sub || ''), email: (payload as any).email };
    if (!user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}
