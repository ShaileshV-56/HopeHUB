import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { withClient } from '../db/pool';
import { sendFoodRequestNotification, type EmailRecipient } from '../services/email';

const createSchema = z.object({
  requesterName: z.string().min(1),
  phone: z.string().regex(/^[0-9]{10}$/),
  email: z.string().email().optional().nullable(),
  organization: z.string().optional().nullable(),
  requestedItem: z.string().min(1),
  quantity: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional().nullable(),
  neededBy: z.string().min(1),
});

const updateSchema = z.object({
  requesterName: z.string().min(1).optional(),
  phone: z.string().regex(/^[0-9]{10}$/).optional(),
  email: z.string().email().optional().nullable(),
  organization: z.string().optional().nullable(),
  requestedItem: z.string().min(1).optional(),
  quantity: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  neededBy: z.string().optional(),
  status: z.string().optional(),
});

export const foodRequestsRouter = Router();

// POST /api/food-requests
foodRequestsRouter.post('/', validateBody(createSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof createSchema>;
    const userId = (req as any).user?.id || null;

    const { rows } = await withClient((client) => client.query(
      `INSERT INTO food_requests (
        requester_name, phone, email, organization, requested_item, quantity, location,
        description, needed_by, status, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active',$10) RETURNING *`,
      [
        body.requesterName,
        body.phone,
        body.email ?? null,
        body.organization ?? null,
        body.requestedItem,
        body.quantity,
        body.location,
        body.description ?? null,
        body.neededBy,
        userId,
      ]
    ));

    // Send notification emails to all registered users and organizations
    try {
      const usersResult = await withClient((client) => client.query('SELECT name, email FROM users'));
      const orgsResult = await withClient((client) => client.query('SELECT contact_person as name, email FROM helper_organizations'));

      const recipients: EmailRecipient[] = [
        ...usersResult.rows.map((u: any) => ({ email: u.email, name: u.name })),
        ...orgsResult.rows.map((o: any) => ({ email: o.email, name: o.name })),
      ].filter(r => !!r.email);

      if (recipients.length > 0) {
        await sendFoodRequestNotification(
          body.requesterName,
          body.requestedItem,
          body.quantity,
          body.organization || 'Individual',
          recipients
        );
      }
    } catch (emailErr) {
      console.error('[food-requests] Failed to send email notification:', emailErr);
    }

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/food-requests
foodRequestsRouter.get('/', async (_req, res, next) => {
  try {
    const { rows } = await withClient((client) => client.query('SELECT * FROM food_requests ORDER BY created_at DESC'));
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/food-requests/:id
foodRequestsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await withClient((client) => client.query('SELECT * FROM food_requests WHERE id = $1', [id]));
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/food-requests/:id
foodRequestsRouter.put('/:id', validateBody(updateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as z.infer<typeof updateSchema>;
    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, any> = {
      requester_name: body.requesterName,
      phone: body.phone,
      email: body.email,
      organization: body.organization,
      requested_item: body.requestedItem,
      quantity: body.quantity,
      location: body.location,
      description: body.description,
      needed_by: body.neededBy,
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
    const { rows } = await withClient((client) => client.query(`UPDATE food_requests SET ${fields.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`, params));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});
