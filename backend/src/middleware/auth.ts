import type { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }
  try {
    const payload = verify(token, env.jwtSecret as Secret);
    // @ts-expect-error attach user payload for downstream usage
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
}
