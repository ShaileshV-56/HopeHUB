import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';

const router = Router();

const donationSchema = z.object({
  organization: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email().nullable().optional(),
  phone: z.string().regex(/^\d{10}$/),
  foodType: z.string().min(1),
  quantity: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
  availableUntil: z.string().datetime(),
});

router.post('/food', async (req, res, next) => {
  try {
    const data = donationSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO public.food_donations (
        organization, contact_person, email, phone, food_type, quantity, location, description, available_until, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'available')
      RETURNING *`,
      [
        data.organization,
        data.contactPerson,
        data.email ?? null,
        data.phone,
        data.foodType,
        data.quantity,
        data.location,
        data.description ?? null,
        data.availableUntil,
      ]
    );

    res.json({ success: true, message: 'Food donation submitted successfully', donation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
