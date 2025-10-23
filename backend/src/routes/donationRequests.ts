import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { withClient } from '../db/pool';

const createSchema = z.object({
  donationId: z.string().uuid(),
  helperOrgId: z.string().uuid(),
  notes: z.string().optional(),
});

export const donationRequestsRouter = Router();

// POST /api/donation-requests

donationRequestsRouter.post('/', validateBody(createSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof createSchema>;

    const { rows: existing } = await withClient((client) => client.query(
      'SELECT 1 FROM donation_requests WHERE donation_id = $1 AND helper_org_id = $2',
      [body.donationId, body.helperOrgId]
    ));
    if (existing.length) return res.status(400).json({ success: false, message: 'Request already exists' });

    const { rows } = await withClient((client) => client.query(
      `INSERT INTO donation_requests (donation_id, helper_org_id, notes, status)
       VALUES ($1, $2, $3, 'requested') RETURNING *`,
      [body.donationId, body.helperOrgId, body.notes ?? null]
    ));
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/donation-requests

donationRequestsRouter.get('/', async (req, res, next) => {
  try {
    const { status } = req.query as Record<string, string | undefined>;
    const clauses: string[] = [];
    const params: any[] = [];
    if (status) { clauses.push('dr.status = $1'); params.push(status); }
    const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';

    const { rows } = await withClient((client) => client.query(
      `SELECT dr.*, fd.organization, ho.organization_name
       FROM donation_requests dr
       JOIN food_donations fd ON fd.id = dr.donation_id
       JOIN helper_organizations ho ON ho.id = dr.helper_org_id
       ${where}
       ORDER BY dr.requested_at DESC`, params
    ));
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/donation-requests/:id

donationRequestsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await withClient((client) => client.query('SELECT * FROM donation_requests WHERE id = $1', [id]));
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Donation request not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/donation-requests/:id/status

donationRequestsRouter.patch('/:id/status', validateBody(z.object({ status: z.string().min(1) })), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as { status: string };
    const { rows } = await withClient((client) => client.query('UPDATE donation_requests SET status = $1 WHERE id = $2 RETURNING *', [body.status, id]));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});
