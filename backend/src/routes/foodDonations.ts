import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { withClient } from '../db/pool';
import { sendFoodRequestNotification, type EmailRecipient } from '../services/email';

const createSchema = z.object({
  organization: z.string().min(1).optional(),
  organizationId: z.string().uuid().optional(),
  contactPerson: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/),
  email: z.string().email().optional().nullable(),
  foodType: z.string().min(1),
  quantity: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional().nullable(),
  availableUntil: z.string().min(1),
});

const updateSchema = z.object({
  organization: z.string().min(1).optional(),
  contactPerson: z.string().min(1).optional(),
  phone: z.string().regex(/^\d{10}$/).optional(),
  email: z.string().email().optional().nullable(),
  foodType: z.string().min(1).optional(),
  quantity: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  availableUntil: z.string().optional(),
  status: z.string().optional(),
});

export const foodDonationsRouter = Router();

// POST /api/donations/food
foodDonationsRouter.post('/', requireAuth, validateBody(createSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof createSchema>;
    const userId = (req as any).user?.id as string;
    
    const { rows } = await withClient((client) => client.query(
      `INSERT INTO food_donations (
        organization, contact_person, phone, email, food_type, quantity, location,
        description, available_until, status, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'available',$10) RETURNING *`,
      [
        body.organization ?? null,
        body.contactPerson,
        body.phone,
        body.email ?? null,
        body.foodType,
        body.quantity,
        body.location,
        body.description ?? null,
        body.availableUntil,
        userId,
      ]
    ));

    try {
      const usersResult = await withClient((client) => 
        client.query('SELECT name, email FROM users')
      );
      const orgsResult = await withClient((client) => 
        client.query('SELECT contact_person as name, email FROM helper_organizations')
      );
      
      const recipients: EmailRecipient[] = [
        ...usersResult.rows.map(u => ({ email: u.email, name: u.name })),
        ...orgsResult.rows.map(o => ({ email: o.email, name: o.name })),
      ];

      if (recipients.length > 0) {
        await sendFoodRequestNotification(
          body.contactPerson,
          body.foodType,
          body.quantity,
          body.organization ?? 'Individual',
          recipients
        );
      }
    } catch (emailError) {
      console.error('[food-donations] Failed to send email notification:', emailError);
    }

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/donations/food
foodDonationsRouter.get('/', async (req, res, next) => {
  try {
    const { status } = req.query as Record<string, string | undefined>;
    const clauses: string[] = [];
    const params: any[] = [];
    if (status) { clauses.push('status = $1'); params.push(status); }
    const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
    const { rows } = await withClient((client) => client.query(`SELECT * FROM food_donations ${where} ORDER BY created_at DESC`, params));
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/donations/food/:id
foodDonationsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await withClient((client) => client.query('SELECT * FROM food_donations WHERE id = $1', [id]));
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/donations/food/:id (only owner)
foodDonationsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id as string;
    const { rowCount } = await withClient((client) =>
      client.query('DELETE FROM food_donations WHERE id = $1 AND user_id = $2', [id, userId])
    );
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    return res.json({ success: true, message: 'Donation deleted' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/donations/food/:id
foodDonationsRouter.put('/:id', validateBody(updateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as z.infer<typeof updateSchema>;
    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, any> = {
      organization: body.organization,
      contact_person: body.contactPerson,
      phone: body.phone,
      email: body.email,
      food_type: body.foodType,
      quantity: body.quantity,
      location: body.location,
      description: body.description,
      available_until: body.availableUntil,
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
    const { rows } = await withClient((client) => client.query(`UPDATE food_donations SET ${fields.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`, params));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/donations/food/:id/status
foodDonationsRouter.patch('/:id/status', validateBody(z.object({ status: z.string().min(1) })), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as { status: string };
    const { rows } = await withClient((client) => client.query('UPDATE food_donations SET status = $1, updated_at = now() WHERE id = $2 RETURNING *', [body.status, id]));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});
