import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { withClient } from '../db/pool';

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  bloodGroup: z.string().min(1),
  age: z.number().int().min(18).max(65),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  lastDonationDate: z.string().optional(),
  medicalConditions: z.string().optional(),
});

const updateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10}$/).optional(),
  bloodGroup: z.string().min(1).optional(),
  age: z.number().int().min(18).max(65).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  available: z.boolean().optional(),
  lastDonationDate: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export const donorsRouter = Router();

// Register donor
// POST /api/donors/register

// Deprecated: blood donors registration is disabled in food-only mode
donorsRouter.post('/register', (_req, res) => {
  return res.status(410).json({ success: false, message: 'Blood donor registration is no longer supported.' });
});
  try {
    const body = (req as any).validatedBody as z.infer<typeof registerSchema>;
    const result = await withClient(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO blood_donors (
          full_name, email, phone, blood_group, age, address, city, state,
          last_donation_date, medical_conditions
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
          body.fullName,
          body.email,
          body.phone,
          body.bloodGroup,
          body.age,
          body.address,
          body.city,
          body.state,
          body.lastDonationDate ?? null,
          body.medicalConditions ?? null,
        ]
      );
      return rows[0];
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/donors
// Optional filters: bloodGroup, city, available

donorsRouter.get('/', (_req, res) => {
  return res.status(410).json({ success: false, message: 'Blood donor listing is no longer supported.' });
});

// GET /api/donors/:id

donorsRouter.get('/:id', (_req, res) => {
  return res.status(410).json({ success: false, message: 'Blood donor details are no longer supported.' });
});

// PUT /api/donors/:id

donorsRouter.put('/:id', (_req, res) => {
  return res.status(410).json({ success: false, message: 'Blood donor update is no longer supported.' });
});
