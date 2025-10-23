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

donorsRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
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

donorsRouter.get('/', async (req, res, next) => {
  try {
    const { bloodGroup, city, available } = req.query as Record<string, string | undefined>;
    const clauses: string[] = [];
    const params: any[] = [];
    if (bloodGroup) { clauses.push('blood_group = $' + (params.length + 1)); params.push(bloodGroup); }
    if (city) { clauses.push('city = $' + (params.length + 1)); params.push(city); }
    if (typeof available !== 'undefined') { clauses.push('available = $' + (params.length + 1)); params.push(available === 'true'); }
    const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
    const { rows } = await withClient((client) => client.query(`SELECT * FROM blood_donors ${where} ORDER BY created_at DESC`, params));
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/donors/:id

donorsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await withClient((client) => client.query('SELECT * FROM blood_donors WHERE id = $1', [id]));
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Donor not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/donors/:id

donorsRouter.put('/:id', validateBody(updateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as z.infer<typeof updateSchema>;
    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, any> = {
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      blood_group: body.bloodGroup,
      age: body.age,
      address: body.address,
      city: body.city,
      state: body.state,
      available: body.available,
      last_donation_date: body.lastDonationDate,
      medical_conditions: body.medicalConditions,
    };

    Object.entries(mapping).forEach(([col, val]) => {
      if (typeof val !== 'undefined') {
        params.push(val);
        fields.push(`${col} = $${params.length}`);
      }
    });

    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

    params.push(id);
    const { rows } = await withClient((client) => client.query(`UPDATE blood_donors SET ${fields.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`, params));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});
