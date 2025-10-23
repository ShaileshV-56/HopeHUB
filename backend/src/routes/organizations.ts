import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';

const router = Router();

const orgSchema = z.object({
  organizationName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  address: z.string().min(1),
  specialization: z.string().optional(),
  capacity: z.number().int().nonnegative().optional(),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = orgSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO public.helper_organizations (
        organization_name, contact_person, email, phone, address, specialization, capacity, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,'active')
      RETURNING *`,
      [
        data.organizationName,
        data.contactPerson,
        data.email,
        data.phone,
        data.address,
        data.specialization ?? null,
        data.capacity ?? null,
      ]
    );

    res.json({ success: true, message: 'Organization registered successfully', organization: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
