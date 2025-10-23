import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';

const router = Router();

const donorSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  age: z.number().int().min(18).max(65),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  lastDonationDate: z.string().datetime().optional(),
  medicalConditions: z.string().optional(),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = donorSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO public.blood_donors (
        full_name, email, phone, blood_group, age, address, city, state, last_donation_date, medical_conditions, available
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
      RETURNING *`,
      [
        data.fullName,
        data.email,
        data.phone,
        data.bloodGroup,
        data.age,
        data.address,
        data.city,
        data.state,
        data.lastDonationDate ?? null,
        data.medicalConditions ?? null,
      ]
    );

    res.json({ success: true, message: 'Donor registered successfully', donor: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
