import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { withClient } from '../db/pool';

const registerSchema = z.object({
  organizationName: z.string().min(1),
  contactPerson: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  address: z.string().min(1),
  description: z.string().optional(),
  capacity: z.number().int().min(0).optional(),
  specialization: z.string().optional(),
});

const updateSchema = z.object({
  organizationName: z.string().min(1).optional(),
  contactPerson: z.string().min(1).optional(),
  phone: z.string().regex(/^\d{10}$/).optional(),
  email: z.string().email().optional(),
  address: z.string().min(1).optional(),
  capacity: z.number().int().min(0).optional(),
  specialization: z.string().optional(),
  status: z.string().optional(),
});

export const organizationsRouter = Router();

// POST /api/organizations/register
organizationsRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof registerSchema>;
    const userId = (req as any).user?.id || null;
    const { rows } = await withClient((client) => client.query(
      `INSERT INTO helper_organizations (
        organization_name, contact_person, phone, email, address, description, capacity, specialization, status, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',$9) RETURNING *`,
      [
        body.organizationName,
        body.contactPerson,
        body.phone,
        body.email,
        body.address,
        body.description ?? null,
        body.capacity ?? null,
        body.specialization ?? null,
        userId,
      ]
    ));
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/organizations
organizationsRouter.get('/', async (_req, res, next) => {
  try {
    const { rows } = await withClient((client) => client.query('SELECT * FROM helper_organizations ORDER BY created_at DESC'));
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/organizations/:id
organizationsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await withClient((client) => client.query('SELECT * FROM helper_organizations WHERE id = $1', [id]));
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/organizations/:id (only owner)
organizationsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id as string;
    const { rowCount } = await withClient((client) =>
      client.query('DELETE FROM helper_organizations WHERE id = $1 AND user_id = $2', [id, userId])
    );
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    return res.json({ success: true, message: 'Organization deleted' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/organizations/:id
organizationsRouter.put('/:id', validateBody(updateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as z.infer<typeof updateSchema>;
    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, any> = {
      organization_name: body.organizationName,
      contact_person: body.contactPerson,
      phone: body.phone,
      email: body.email,
      address: body.address,
      capacity: body.capacity,
      specialization: body.specialization,
      status: body.status,
    };

    Object.entries(mapping).forEach(([col, val]) => {
      if (typeof val !== 'undefined') {
        params.push(val);
        fields.push(`${col} = $${params.length}`);
      }
    });

    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

    params.push(id);
    const { rows } = await withClient((client) => client.query(`UPDATE helper_organizations SET ${fields.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`, params));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});
