import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import type { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import { withClient } from '../db/pool';
import { env } from '../config/env';
import { validateBody } from '../middleware/validate';

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = Router();

// Minimal users table via migration 002

// POST /api/auth/signup
authRouter.post('/signup', validateBody(signupSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof signupSchema>;

    const existing = await withClient((client) => client.query('SELECT id FROM users WHERE email = $1', [body.email]));
    if (existing.rows[0]) return res.status(409).json({ success: false, message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const { rows } = await withClient((client) => client.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email, created_at',
      [body.name, body.email, passwordHash]
    ));

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/signin
authRouter.post('/signin', validateBody(signinSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof signinSchema>;

    const { rows } = await withClient((client) => client.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [body.email]));
    const user = rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await bcrypt.compare(body.password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = sign(
      { sub: user.id, email: user.email },
      env.jwtSecret as Secret,
      { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] }
    );
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email } } });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
authRouter.get('/me',async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, message: 'Missing token' });
  try {
    const payload = verify(token, env.jwtSecret as Secret) as JwtPayload | string;
    if (typeof payload === 'string') return res.status(401).json({ success: false, message: 'Invalid token' });
    const { rows } = await withClient((client) => client.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [payload.sub]
    ));
    const user = rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    
    res.json({ success: true, data: user });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// POST /api/auth/signout (stateless)
authRouter.post('/signout', (_req, res) => {
  res.json({ success: true, message: 'Signed out' });
});
